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
  
  const msg = Object.assign({}, event, { from: 'bot', bp: null })
  bp.events.emit('modules.web.message',  msg)
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
    
    bp.events.on('modules.web.message', message => {
      if (!message) {
        return
      }

      // Discard messages emited from the bot itself.
      if (_.get(message, 'from') === 'bot') {
        return
      }

      // TODO Support more types like attachment
      bp.middlewares.sendIncoming({
        platform: 'web',
        type: 'message',
        user: message.from, // TODO Authenticate users somehow (cookies, localStorage, userId)
        text: message.text,
        raw: message
      })
    })

  }
}
