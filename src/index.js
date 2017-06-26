import util from 'util'

import _ from 'lodash'
import Promise from 'bluebird'

import umm from './umm'

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

module.exports = {

  config: { },

  init: async function(bp, configurator) {
    bp.middlewares.register({
      name: 'web.sendMessages',
      type: 'outgoing',
      order: 100,
      handler: outgoingMiddleware(bp),
      module: 'botpress-web',
      description: 'Sends out messages that targets platform = web.' +
      ' This middleware should be placed at the end as it swallows events once sent.'
    })

    umm(bp) // Initialize UMM
  },

  ready: async function(bp, configurator) {
    // Your module's been loaded by Botpress.
    // Serve your APIs here, execute logic, etc.

    const config = await configurator.loadAll()
    
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

      bp.events.emit('modules.web.session_started', event)
    })

  }
}
