import style from './style.scss'

import BotAvatar from './bot_avatar'

const TypingIndicator = props => {
  if (!props.enabled) {
    return null
  }

  const bubble = () => <div className={style.typingBubble} style={{ backgroundColor: props.color }}/>
  
  const passthroughProps = {
    foregroundColor: props.color,
    ...props
  }

  return <div className={style.message}>
    <BotAvatar {...passthroughProps} />
    <div className={style['message-container']}>
      <div className={style.content}>
        <div className={style.bubble}>
          <div className={style.typingGroup}>
            {bubble()}
            {bubble()}
            {bubble()}
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default TypingIndicator
