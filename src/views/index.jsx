import React from 'react'

import Chat from './components/chat'
import ChatSession from './components/chat-session'

import style from './style.scss'

export default class TemplateModule extends React.Component {

  constructor(props) {
    super()
    this.session = new ChatSession({ events: props.bp.events })
  }

  render() {
    return <Chat 
      session={this.session}
    />
  }
}
