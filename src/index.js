import umm from './umm'
import api from './api'
import socket from './socket'
import db from './db'

module.exports = {

  config: { },

  init: async function(bp, configurator) {
    const config = await configurator.loadAll()

    // Setup the socket events
    await socket(bp, config)

    // Initialize UMM
    return umm(bp)
  },

  ready: async function(bp, configurator) {
    const config = await configurator.loadAll()
    
    const knex = await bp.db.get()

    // Initialize the database
    db(knex, bp.botfile).initialize()

    // Setup the APIs
    await api(bp, config)

    // Reload middleware TODO remove this
    bp.middlewares.load()
  }
}
