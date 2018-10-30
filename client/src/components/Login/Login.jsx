import React from 'react'
import './Login.css'

const login = props => {
  const { handlePlayerLogin, handleSpectatorLogin, handleChange, players } = { ...props }
  // console.log('players', players)
  const handleEnter = e => {
    const { keyCode } = { ...e }
    if (keyCode === 13) return handlePlayerLogin()
  }
  let playButton = null
  if (players && players.length === 0) playButton = (
    <button onClick={handlePlayerLogin}>Create New Game</button>
  )
  if (players && players.length === 1) playButton = (
    <button onClick={handlePlayerLogin}>Join Game</button>    
  )
  return (
    <div className='Login'>
      {/* { players && players.length } */}
      <input onChange={handleChange} onKeyDown={handleEnter} name='userName' type="text"/>
      { playButton }
      <button onClick={handleSpectatorLogin}>Spectate Game</button>
    </div>
  )
}

export default login