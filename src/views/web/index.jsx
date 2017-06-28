import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'

import Convo from './convo'
import Side from './side'

import style from './style.scss'

export default class Web extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      view: 'convo'
    }
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
    return <button onClick={::this.handleButtonClicked}>
        <i>{this.state.view === 'convo' ? this.renderCloseIcon() : this.renderOpenIcon()}</i>
      </button>
  }

  renderWidget() {
    return <div className={classnames(style['container'])}>
        <div className={classnames(style['widget-container'])}> 
          <span>
            {this.state.view === 'convo' ? <Convo /> : null}
            {this.renderButton()}
          </span>
        </div>
      </div>
  }

  renderSide() {
    return <Side close={::this.handleClosePanel} />
  }

  render() {
    window.parent.postMessage({ type: 'setClass', value: 'bp-widget-web bp-widget-' + this.state.view }, "*")
    
    return <div className={style.web}>
        {this.state.view !== 'side' ? this.renderWidget() : this.renderSide()}
      </div>
  }
}
