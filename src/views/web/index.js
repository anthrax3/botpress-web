import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'

import style from './style.scss'

class Web extends React.Component {

  constructor(props) {
    super(props)
  }


  render() {
    const classNames = classnames(style.web)
    
    return <div className={classNames}>
        <h1>YOYO</h1>
      </div>
  }
}

module.exports = Web
