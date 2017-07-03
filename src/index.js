import util from 'util'

import _ from 'lodash'
import Promise from 'bluebird'
import path from 'path'
import fs from 'fs'

import umm from './umm'
import api from './api'
import socket from './socket'
import db from './db'

const createConfigFile = (bp) => {
  const name = 'botpress-web.config.yml'
  const file = path.join(bp.projectLocation, name)

  if (!fs.existsSync(file)) {
    
    const template = fs.readFileSync(path.resolve(__dirname, '..' ,name))
    fs.writeFileSync(file, template)

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
    textColorOnBackground: { type: 'string', required: false, default: '#000000' },
    foregroundColor: { type: 'string', required: false, default: '#ffffff' },
    textColorOnForeground: { type: 'string', required: false, default: '#ffffff' }
  },

  init: async function(bp, configurator) {
    const config = await configurator.loadAll()

    // Setup the socket events
    await socket(bp, config)

    createConfigFile(bp) //Create a config file
    umm(bp) // Initialize UMM
    return umm(bp)
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

    const knex = await bp.db.get()

    // Initialize the database
    db(knex, bp.botfile).initialize()

    // Setup the APIs
    await api(bp, config)
  }
}
