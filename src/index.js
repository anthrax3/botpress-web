import util from 'util'
import _ from 'lodash'
import Promise from 'bluebird'
import path from 'path'
import fs from 'fs'

import umm from './umm'
import api from './api'
import socket from './socket'
import db from './db'

import injectScript from 'raw!./inject.js'
import injectStyle from 'raw!./inject.css'

import configTemplate from 'raw!./botpress-web.config.yml'

const outgoingTypes = ['text']

const parseTyping = msg => {
  if (msg.raw && !!msg.raw.typing) {
    if (isNaN(msg.raw.typing)) {
      return 1000
    } else {
      return Math.max(msg.raw.typing, 500)
    }
  }

  return false
}

const outgoingMiddleware = bp => async (event, next) => {
  if (event.platform !== 'web') {
    return next()
  }

  if (!_.includes(outgoingTypes, event.type)) {
    return next('Unsupported event type: ' + event.type)
  }

  // TODO Currently this will broadcast to all sockets
  // TODO We must target a single socket / client

  const extractSocketId = () => {
    let to = (event.raw && event.raw.to) || (event.user)

    if (to && to.id) {
      to = to.id
    }

    if (!to || !to.length) {
      next(new Error("Could not find who to send this message to: " + util.inspect(event)))
    }

    if (to.indexOf(':') >= 0) {
      to = to.split(':')[1]
    }

    if (to.indexOf('+') >= 0) {
      to = to.split('+')[0]
    }

    return to
  }

  let user = await getOrCreateUser(bp, extractSocketId())

  const msg = Object.assign({}, event, {
    from: 'bot',
    bp: null,
    __userId: user.id,
    __socketId: user && user.socketId // send back only to the sender
  })

  const typing = parseTyping(msg)

  if (typing) {
    bp.events.emit('modules.web.typing', msg)
    await Promise.delay(typing)
  }

  bp.events.emit('modules.web.message', msg)

  if (msg._promise && msg._resolve) {
    msg._resolve()
  }
}

const users = {}
let usersCount = 0

const getOrCreateUser = async (bp, socketId) => {
  if (!users[socketId]) {

    const uniqueId = socketId + '+' + (`${Math.random()}`.substr(2, 5))
    users[socketId] = {
      first_name: 'Anonymous',
      last_name: '#' + usersCount++,
      profile_pic: 'http://350cr.blogs.brynmawr.edu/files/2013/05/anonymous.jpg', // TODO Remove that
      socketId: socketId,
      id: uniqueId,
      platform: 'web'
    }

    await bp.db.saveUser(users[socketId])
  }

  return users[socketId]
}

const getUserById = (userId) => {
  return _.find(users, { id: userId })
}

const startNewSession = (bp, socketId) => {
  delete users[socketId]
  return getOrCreateUser(bp, socketId)
}

const createConfigFile = (bp) => {
  const name = 'botpress-web.config.yml'
  const file = path.join(bp.projectLocation, name)

  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, configTemplate)

    bp.notifications.send({
      level: 'info',
      message: name + ' has been created, fill it'
    })
  }
}

module.exports = {
  config: {
    locale: { type: 'string', required: false, default: 'en-US' },
    messages: { 
      type: 'any', required: false, 
      default: {
        welcomeMessage: 'Hey there!',
        awayMessage: "Hey, we're not here right now, but leave a message.",
        emailCaptureMessage: "Leave your email so we can get back to you.",
        thankYouMessage: "Thanks we'll follow up soon."
      }
    },
    enableWelcomeMessage: { type: 'bool', required: false, default: false },
    enableCampaigns: { type: 'bool', required: false, default: false },
    enableChatTargeting: { type: 'bool', required: false, default: false },
    welcomeMessageDelay: { type: 'any', required: false, default: 5000 },
    
    backgroundColor: { type: 'string', required: false, default: '#000000' },
    textColorOnBackground: { type: 'string', required: false, default: '#666666' },
    foregroundColor: { type: 'string', required: false, default: '#0176ff' },
    textColorOnForeground: { type: 'string', required: false, default: '#ffffff' }
  },

  init: async function(bp, configurator) {
    const config = await configurator.loadAll()

    // Setup the socket events
    await socket(bp, config)

    createConfigFile(bp) //Create a config file
    umm(bp) // Initialize UMM
  },

  ready: async function(bp, configurator) {
    const config = await configurator.loadAll()

    const router = bp.getRouter('botpress-web', { auth: false })
    
    router.get('/config', async (req, res) => {
      res.json(await configurator.loadAll())
    })

    router.post('/config', async (req, res) => {
      await configurator.saveAll(newConfigs)
      res.json(await configurator.loadAll())
    })

    router.get('/inject.js', (req, res) => {
      res.contentType('text/javascript')
      res.send(injectScript)
    })

    router.get('/inject.css', (req, res) => {
      res.contentType('text/css')
      res.send(injectStyle)
    })

    bp.events.on('modules.web.message', async (message, from, metadata) => {
      if (!message) {
        return
      }

      // Discard messages emited from the bot itself.
      if (_.get(message, 'from') === 'bot') {
        return
      }

      // If there's no client identifier, discard the event (should never happen)
      if (!(metadata && metadata.socketId)) {
        return
      }

      const user = await getOrCreateUser(bp, metadata.socketId)

      // TODO Support more types like attachment
      bp.middlewares.sendIncoming({
        platform: 'web',
        type: 'message',
        user: user,
        text: message.text,
        raw: message
      })
    })

    bp.events.on('modules.web.new_session', async (message, from, metadata) => {
      if (!(metadata && metadata.socketId)) {
        return
      }

      const user = await startNewSession(bp, metadata.socketId)

      const event = {
        from: 'bot',
        userId: user.id,
        __socketId: user && user.socketId // send back only to the sender
      }
    })

    const knex = await bp.db.get()

    // Initialize the database
    db(knex, bp.botfile).initialize()

    // Setup the APIs
    await api(bp, config)

    // Reload middleware TODO remove this
    bp.middlewares.load()
  }
}
