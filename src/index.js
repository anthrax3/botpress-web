import umm from './umm'
import api from './api'
import socket from './socket'

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
    
    // Setup the APIs
    await api(bp, config)    
  }
}
