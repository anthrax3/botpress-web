import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'

import Send from '../send'
import Input from '../input'

import style from './style.scss'

export default class Convo extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      text: ''
    }
  }

  handleTextChanged(event) {
    this.setState({
      text: event.target.value
    })
  }

  renderSendButton() {
    return <span>
      <div className={style['enter-prompt']}>
        <a>
          <i class="flex"><svg width="13" height="13" viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg"><path d="M12.975.38c.014.043.02.087.024.132v.06c-.004.048-.014.095-.03.14-.006.017-.007.032-.014.046L7.252 12.692c-.09.19-.28.308-.49.308-.216-.002-.406-.127-.493-.32l-.537-3.41C5.56 8.18 4.55 7.1 3.478 6.86l-3.2-.72c-.18-.1-.287-.293-.277-.5.012-.206.138-.39.328-.47L12.248.04 12.3.026c.05-.015.098-.025.148-.026.02 0 .038 0 .058.003.046.004.09.013.132.028l.055.02c.056.027.11.06.154.107.053.053.085.11.11.168.008.018.013.036.018.055z" fill-rule="evenodd"></path></svg></i>
          <span>Send Message</span>
        </a>
      </div>
    </span>
  }


  renderPromoElement() {
    const platform = 'Botpress'
    const link = 'https://botpress.io'

    return <span>
      <div className={style['flex-minimal']}>
        <div className={style.element}>
          <span>
            {"We're "}
            <i><svg width="7" height="13" viewBox="0 0 7 13" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M4.127.496C4.51-.12 5.37.356 5.16 1.07L3.89 5.14H6.22c.483 0 .757.616.464 1.044l-4.338 6.34c-.407.595-1.244.082-1.01-.618L2.72 7.656H.778c-.47 0-.748-.59-.48-1.02L4.13.495z" fill="#F6A623"></path><path fill="#FEF79E" d="M4.606.867L.778 7.007h2.807l-1.7 5.126 4.337-6.34H3.16"></path></g></svg></i>
            {" by "}
            <a href={link} target='_blank'>{platform}</a>
          </span>
        </div>
      </div>
    </span>
  }

  render() {
    const name = 'Dany Fortin-Simard'
    const avatar_url = 'https://avatars3.githubusercontent.com/u/5629987?v=3&u=dfd5eb1c9fa2301ece76034b157cef8d38f89022&s=400'
    const text = <div className={style.paragraph}>
        <p>Hello!</p>
        <p><br/></p>
        <p>Curious about Botpress?</p>
        <p><br/></p>
        <p>It will be a pleasure to help you getting started.</p>
      </div>

    return <div className={style.external}>
        <div className={style.internal}>
          <div className={style.header}>
            <div className={style.line}>
              <div className={style.title}>
                <div className={style.avatar}>
                  <div className={style.square}>
                    <div className={style.circle}>
                      <div className={style.picture} style={{ backgroundImage: 'url(' + avatar_url +')'}}></div>
                    </div>
                  </div>
                </div>
                <div className={style.name}>
                  <div>
                    <span>{name}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.text}>
              {text}
            </div>
          </div>
          <div className={classnames(style.composer)}>
            <div className={style['flex-column']}>
              <Input
                send={this.props.send}
                change={this.props.change} 
                placeholder='Type your message...'
                text={this.props.text} />
              <div className={style.bottom}>
                <Send
                  text={this.props.text}
                  send={this.props.send} />
              </div>
            </div>
          </div>
        </div>
      </div> 
  }
}
