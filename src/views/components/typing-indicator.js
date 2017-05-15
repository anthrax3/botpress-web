import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'

import style from './style.scss'

class TypingIndicator extends React.Component {
  render() {

    return <div className={classnames(style.typing, style.message)}><img src="res/typing.gif"/></div>
  }
}

module.exports = TypingIndicator
