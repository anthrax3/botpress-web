import React, { Component } from 'react'

import style from './style.scss'

export default class Send extends Component {
  
  constructor(props) {
    super(props)
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.props.send()
      e.preventDefault()
    }
  }

  render() {
    return <div tabIndex="-1" className={style.input}>
        <textarea tabindex="1"
          placeholder={this.props.placeholder}
          onChange={this.props.change}
          value={this.props.text} 
          onKeyPress={::this.handleKeyPress} >
        </textarea>
      </div>
  }
}

