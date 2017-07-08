import style from './style.scss'

const TypingIndicator = props => {
  if (!props.enabled) {
    return null
  }

  const bubble = () => <div className={style.typingBubble} style={{ backgroundColor: props.color }}/>
  
  return <div className={style.message}>
    <div className={style.avatar}>
      <div className={style.picture} style={{ backgroundImage: 'url(' + props.avatar_url +')'}}></div>
    </div>
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
