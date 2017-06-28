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
          <div className={style['info-line']}>{m.name}</div>
          <div className={style.content}>
            <div className={style.bubble}>
              <div>
                <p>{m.message.text}</p>
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
            <div className={style.bubble}>
              <div>
                <p>{m.message.text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  }

  render() {
    const m = this.props.data
    const message = m.fromUser
      ? this.renderFromUser(m)
      : this.renderFromBot(m)

    return <div>
      {message}
    </div>
  }
}

  