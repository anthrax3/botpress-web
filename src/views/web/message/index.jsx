import React, { Component } from 'react'
import classnames from 'classnames'

import style from './style.scss'

export default class Message extends Component {
  
  constructor(props) {
    super(props)
  }

  renderFromBot(m) {
    return <div className={style.message}>
        <div className={style.avatar}>
          <div className={style.picture} style={{ backgroundImage: 'url(' + m.avatar_url +')'}}></div>
        </div>
        <div className={style['message-container']}>
          <div className={style['info-line']}>{m.full_name}</div>
          <div className={style.content}>
            <div className={style.bubble}>
              <div>
                <p>{m.message_text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  }

  renderFromUser(m) {
    const classNames = classnames(style.message, style.user)
    
    return <div className={classNames}>
        <div className={style['message-container']}>
          <div className={style.content}>
            <div className={style.bubble}
              style={{
                backgroundColor: this.props.config.foregroundColor
              }}>
              <div>
                <p>{m.message_text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  }

  render() {
    const data = this.props.data
    const fromUser = !!data.userId

    const message = fromUser
      ? this.renderFromUser(data)
      : this.renderFromBot(data)

    return <div>{message}</div>
  }
}
