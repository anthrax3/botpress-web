import React from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import ReactChatView from 'react-chatview'

import TypingIndicator from './typing-indicator'
import Message from './message'

import style from './style.scss'

class MessageList extends React.Component {

  componentDidUpdate() {
    const node = ReactDOM.findDOMNode(this.refs.lastMessage)
    node && node.scrollIntoView()
  }

  loadMoreHistory() {
    // FIXME: Load more messages on demand
  }

  render() {
    var typing = (this.props.typing) ? <TypingIndicator/> : null

    
    return <div className={style.list}>
        
        <ReactCSSTransitionGroup transitionName="fadeInUp" transitionEnterTimeout={5000} transitionLeaveTimeout={5000}>
          { typing }
        </ReactCSSTransitionGroup>

        <ReactChatView 
            className={style.messages}
            flipped={false}
            scrollLoadThreshold={50}
            ref='list'
            onInfiniteLoad={::this.loadMoreHistory}>
          {this.props.messages.map((message, index) => <Message key={index} message={message} ref='lastMessage'/> )}
        </ReactChatView>
      
    </div>
  }
}

module.exports = MessageList
