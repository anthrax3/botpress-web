import _ from 'lodash'

const outgoingTypes = ['text']

const outgoingMiddleware = bp => (event, next) => {
  if (event.platform !== 'web') {
    return next()
  }

  if (!_.includes(outgoingTypes, event.type)) {
    return next('Unsupported event type: ' + event.type)
  }

  // TODO Currently this will broadcast to all sockets
  // TODO We must target a single socket / client

  const user = event.user || (event.raw && event.raw.to && getOrCreateUser(event.raw.to))

  const msg = Object.assign({}, event, {
    from: 'bot',
    bp: null,
    __socketId: user && user.socketId // send back only to the sender
  })

  bp.events.emit('modules.web.message',  msg)
}

const users = {}
let usersCount = 0

const getOrCreateUser = async (bp, socketId) => {
  if (!users[socketId]) {
    users[socketId] = {
      first_name: 'Anonymous',
      last_name: '#' + usersCount++,
      profile_pic: 'http://350cr.blogs.brynmawr.edu/files/2013/05/anonymous.jpg', // TODO Remove that
      socketId: socketId,
      id: socketId,
      platform: 'web'
    }

    await bp.db.saveUser(users[socketId])
  }

  return users[socketId]
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

  }
}
