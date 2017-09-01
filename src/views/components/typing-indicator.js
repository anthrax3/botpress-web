import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'

import Spinner from 'react-spinkit'

import style from './style.scss'

class TypingIndicator extends React.Component {
  render() {
    return <div className={style.typingIndicatorWrapper}>
      <Spinner name='ball-pulse-sync' fadeIn={'quarter'} className={style.spinner}/>
    </div>
  }
}

module.exports = TypingIndicator
