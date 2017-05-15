import EventEmitter from 'events'

//FIXME: Implement events for when message list changes
class ChatSession extends EventEmitter {

  constructor({ events }) {
    super()
    this.events = events

    events.on('modules.web.message', function(msg) {
      // Only listen for messages coming from the bot
      if (msg.from !== 'bot') {
        return
      }

      this.emit('message', {
        class: 'bot',
        text: msg.text,
        attachment: msg.attachment
      })
    }.bind(this))

    events.on('modules.web.typing', function(msg) {
      this.emit('typing')
    }.bind(this))
  }

  send(item) {
    if (item instanceof File) {
      this.sendFile(item)
    } else {
      this.sendText(item)
    }
  }

  sendText(text) {
    this.events.emit('modules.web.message', { text: text })
    this.emit('message', {
      class: 'you',
      text: text
    })
  }

  sendFile(file) {

    var reader = new FileReader()

    reader.onload = function(e) {

      this.emit('message', {
        class: 'you',
        attachment: {
          name: file.name,
          type: file.type,
          data: e.target.result
        }
      })

      this.events.emit('modules.web.message', {
        attachments: [
        {
          type: file.type,
          data: e.target.result
        }
      ]})

    }.bind(this)

    reader.readAsDataURL(file)
  }
}

module.exports = ChatSession
