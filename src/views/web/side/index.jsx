import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'

import style from './style.scss'

export default class Side extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const classNames = classnames(style['side-container'])

    return <div className={classNames}>
        <h1>Side</h1>
        <button onClick={this.props.close}>Close</button>
      </div>
  }
}
