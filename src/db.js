import Promise from 'bluebird'
import moment from 'moment'
import _ from 'lodash'
import { DatabaseHelpers as helpers } from 'botpress'

var knex = null

function initialize() {
  if (!knex) {
    throw new Error('you must initialize the database before')
  }

  return helpers(knex).createTableIfNotExists('web_conversations', function (table) {
    table.increments('id').primary()
    table.string('userId')
    table.string('title')
    table.string('description')
    table.string('logo_url')
    table.timestamp('created_on')
    table.timestamp('last_heard_on')
    table.timestamp('last_seen_on')
  })
  .then(function() {
    return helpers(knex).createTableIfNotExists('web_messages', function (table) {
      table.increments('id').primary()
      table.integer('conversationId')
      table.string('userId')
      table.string('full_name')
      table.string('avatar_url')
    })
  })
}

// TODO
// Append user message to conversation (userId, conversationId, message)
// Append bot message to conversation (botName, botAvatar, conversationId, message)
// Create conversation (userId)
// Patch conversation (userId, conversationId, title, description, logo_url)
// Get conversations (userId)

module.exports = k => {
  knex = k
  return {}
}