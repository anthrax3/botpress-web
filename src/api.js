import injectScript from 'raw!./inject.js'
import injectStyle from 'raw!./inject.css'

import db from './db'

/*
  Supported message types:

  *** type: text ***
      text: "string", up to 360 chars
      raw: null
      data: null

  *** type: file ***
      text: "text associated with the file", up to 360 chars
      raw: {
        file_name: "lol.png"
        file_mime: "image/png"
      }
      data: BINARY_DATA // max size = 10 Mb

 */

module.exports = async (bp, config) => {

  const { listConversations } = db(knex, botfile)

  const router = bp.getRouter('botpress-web', { auth: false })
    
  router.get('/inject.js', (req, res) => {
    res.contentType('text/javascript')
    res.send(injectScript)
  })

  router.get('/inject.css', (req, res) => {
    res.contentType('text/css')
    res.send(injectStyle)
  })

  router.post('/message', async (req, res) => {

  })

  router.get('/conversations/:userId', async (req, res) => {
    if (!/(a-z0-9-_)/i.test(req.params.userId)) {
      res.status(400).send('`userId` is required and must be valid')
    }

    const conversations = await listConversations(req.params.userId)

    return res.send([...conversations])
  })

  async function _getOrCreateRecentConversation(userId) {

  }

  async function sendNewMessage(userId, conversationId, payload) {

  }

  async function sendEvent(userId, event, data) {

  }
}

