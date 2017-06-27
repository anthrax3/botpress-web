import React from 'react'
import classnames from 'classnames'

export default class LiteChat extends React.Component {

  constructor(props) {
    super()
    // this.session = new ChatSession({ events: props.bp.events })
  }

  render() {
    console.log(this.props)
    const events = this.props.bp.events
    

    events.on('guest.lol2', data => {
      console.log('> Lol2', data, arguments)
    })

    window.EVENTS = this.props.bp.events

    events.setup()
    
    // const className = classnames(style.chatComponent, 'bp-modules-chat')
    return <div>
      <h3>There is nothing to see here, yet.</h3>
      <p>This module currently serves to show the Chat Emulator you see at the bottom of your screen. 
      Uninstall this module to get rid of it.</p>
      <p>This module is a work in progress, it will also allow you to embed a chat window to your bot on any website (no ETA yet, please contact us on Slack).</p>
    </div>
  }
}
