/* global: window */

import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import { Emoji } from 'emoji-mart'
import _ from 'lodash'
import moment from 'moment'

import Convo from './convo'
import Side from './side'

import style from './style.scss'

const BOT_HOSTNAME = window.location.origin

export default class Web extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      view: 'convo',
      textToSend: '',
      loading: true,
      conversations: null,
      currentConversation: null,
      currentConversationId: null
    }
  }

  componentWillMount() {
    this.setupSocket()
  }

  componentDidMount() {
    this.fetchData()
    .then(() => {
      this.setState({
        loading: false
      })
    })
  }

  setupSocket() {
    // Connect the Botpress's Web Socket to the server
    if (this.props.bp && this.props.bp.events) {
      this.props.bp.events.setup()
    }

    this.props.bp.events.on('guest.web.message', ::this.handleNewMessage)
    this.props.bp.events.on('guest.web.typing', ::this.handleBotTyping)
  }

  fetchData() {
    return this.fetchConfig()
    .then(::this.fetchConversations)
    .then(::this.fetchCurrentConversation)
  }

  fetchConversations() {
    const axios = this.props.bp.axios
    const userId = window.__BP_VISITOR_ID
    const url = `${BOT_HOSTNAME}/api/botpress-web/conversations/${userId}`

    return axios.get(url)
    .then(({ data }) => {
      this.setState({
        conversations: data
      })
    })
  }

  fetchCurrentConversation() {
    const axios = this.props.bp.axios
    const userId = window.__BP_VISITOR_ID

    let conversationIdToFetch = this.state.currentConversationId
    if (!_.isEmpty(this.state.conversations) && !conversationIdToFetch) {
      conversationIdToFetch = _.first(this.state.conversations).id
      this.setState({ currentConversationId:  conversationIdToFetch })
    }

    const url = `${BOT_HOSTNAME}/api/botpress-web/conversations/${userId}/${conversationIdToFetch}`

    return axios.get(url)
    .then(({data}) => {
      // Possible race condition if the current conversation changed while fetching
      if (this.state.currentConversationId !== conversationIdToFetch) {
        // In which case we simply restart fetching
        return fetchCurrentConversation()
      }

      this.setState({ currentConversation: data })
    })
  }

  fetchConfig() {
    return this.props.bp.axios.get('/api/botpress-web/config')
    .then(({ data }) => {
      this.setState({
        config: data
      })
    })
  }

  handleNewMessage(event) {
    this.safeUpdateCurrentConvo(event.conversationId, convo => {
      return Object.assign({}, convo, {
        messages: [...convo.messages, event],
        typingUntil: event.userId ? convo.typingUntil : null
      })
    })
  }

  handleBotTyping(event) {
    this.safeUpdateCurrentConvo(event.conversationId, convo => {
      return Object.assign({}, convo, {
        typingUntil: moment().add(event.timeInMs, 'milliseconds').toDate()
      })
    })

    setTimeout(::this.expireTyping, event.timeInMs + 50)
  }

  expireTyping() {
    const currentTypingUntil = this.state.currentConversation
      && this.state.currentConversation.typingUntil

    const now = moment()
    const timerExpired = currentTypingUntil && moment(currentTypingUntil).isBefore(now)
    if (timerExpired) {
      this.safeUpdateCurrentConvo(this.state.currentConversationId, convo => {
        return Object.assign({}, convo, { typingUntil: null })
      })
    }
  }

  safeUpdateCurrentConvo(convoId, updater) {
    if (!this.state.currentConversation || this.state.currentConversationId !== convoId) {
      // there's no conversation to update or our convo changed
      return
    }

    const newConvo = updater && updater(this.state.currentConversation)

    if (newConvo) {
      this.setState({ currentConversation: newConvo })
    }
  }

  handleSendMessage() {
    const userId = window.__BP_VISITOR_ID
    const url = `${BOT_HOSTNAME}/api/botpress-web/messages/${userId}`
    const config = { params: { conversationId: this.state.currentConversationId } }

    this.props.bp.axios.post(url, { type: 'text', text: this.state.textToSend }, config)
    .then(() => {
      this.setState({
        view: 'side',
        textToSend: ''
      })
    })
  }

  handleTextChanged(event) {
    this.setState({
      textToSend: event.target.value
    })
  }

  handleAddEmoji(emoji, event) {
    this.setState({
      textToSend: this.state.textToSend + emoji.native + ' '
    })
  }

  handleButtonClicked() {
    if (this.state.view === 'convo') {
      this.setState({
        view: 'widget',
      })
    } else {
      this.setState({
        view: 'side'
      })
    }
  }

  handleSendQuickReply(title, payload) {
    const userId = window.__BP_VISITOR_ID
    const url = `${BOT_HOSTNAME}/api/botpress-web/messages/${userId}`
    const config = { params: { conversationId: this.state.currentConversationId } }

    this.props.bp.axios.post(url, { 
      type: 'quick_reply', 
      text: title, 
      data: { payload } 
    }, config).then()
  }

  handleSwitchConvo(convoId) {
    this.setState({
      currentConversation: null,
      currentConversationId: convoId
    })

    setImmediate(() => {
      this.fetchCurrentConversation()
      .then(() => {
        this.setState({
          view: 'side'
        })
      })
    })
  }

  handleClosePanel() {
    this.setState({
      view: 'widget'
    })
  }

  renderOpenIcon() {
    return <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.583 14.894l-3.256 3.78c-.7.813-1.26.598-1.25-.46a10689.413 10689.413 0 0 1 .035-4.775V4.816a3.89 3.89 0 0 1 3.88-3.89h12.064a3.885 3.885 0 0 1 3.882 3.89v6.185a3.89 3.89 0 0 1-3.882 3.89H4.583z" fill="#FFF" fill-rule="evenodd"></path>
    </svg>
  }

  renderCloseIcon() {
    return <svg width="17" height="17" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.726 15.402c.365.366.365.96 0 1.324-.178.178-.416.274-.663.274-.246 0-.484-.096-.663-.274L8.323 9.648h.353L1.6 16.726c-.177.178-.416.274-.663.274-.246 0-.484-.096-.663-.274-.365-.365-.365-.958 0-1.324L7.35 8.324v.35L.275 1.6C-.09 1.233-.09.64.274.274c.367-.365.96-.365 1.326 0l7.076 7.078h-.353L15.4.274c.366-.365.96-.365 1.326 0 .365.366.365.958 0 1.324L9.65 8.675v-.35l7.076 7.077z" fill="#FFF" fill-rule="evenodd"></path>
      </svg>
  }

  renderButton() {
    return <button
      onClick={::this.handleButtonClicked}
      style={{ backgroundColor: this.state.config.foregroundColor }}>
        <i>{this.state.view === 'convo' ? this.renderCloseIcon() : this.renderOpenIcon()}</i>
      </button>
  }

  renderWidget() {
    return <div className={classnames(style['container'])}>
        <div className={classnames(style['widget-container'])}> 
          <span>
            {this.state.view === 'convo'
              ? <Convo
                change={::this.handleTextChanged}
                send={::this.handleSendMessage}
                config={this.state.config}
                text={this.state.textToSend} /> 
              : null}
            {this.renderButton()}
          </span>
        </div>
      </div>
  }

  renderSide() {
    return <Side
      config={this.state.config}
      text={this.state.textToSend}
      currentConversation={this.state.currentConversation}
      conversations={this.state.conversations}

      addEmojiToText={::this.handleAddEmoji}

      onClose={::this.handleClosePanel}
      onSwitchConvo={::this.handleSwitchConvo}
      onTextSend={::this.handleSendMessage}
      onTextChanged={::this.handleTextChanged}
      onQuickReplySend={::this.handleSendQuickReply} />
  }

  render() {
    if (this.state.loading) {
      return null
    }

    window.parent.postMessage({ type: 'setClass', value: 'bp-widget-web bp-widget-' + this.state.view }, '*')

    return <div className={style.web} >
        {this.state.view !== 'side' ? this.renderWidget() : this.renderSide()}
      </div>
  }
}
