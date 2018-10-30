import React from 'react'
import './Room.css'

const room = props => {
  const { msg, roomObj, handleChange, handleMsgSubmit } = { ...props }
  const { users, msgs } = roomObj
  const handleEnter = e => {
    const { keyCode } = { ...e }
    if (keyCode === 13) return handleMsgSubmit()
  }
  const userContent = users.map((user, i) => {
    return (<p key={i}>{user}</p>)
  })
  const chatContent = msgs.map((msg, i) => {
    return (<p key={i}>{msg}</p>)
  })
  return (
    <div className='Room'>
      I'm the room stuff
      {userContent}
      <div className='msgs'>
        {chatContent}
      </div>
      <input
        className='newMsg'
        onKeyDown={handleEnter}
        onChange={handleChange}
        type='text'
        placeholder='Enter chat msg'
        value={msg}
        name='msg'
      />
    </div>
  )
}

export default room