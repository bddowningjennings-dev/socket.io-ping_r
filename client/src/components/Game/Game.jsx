import React from 'react'
import './Game.css'

import GameInterface from '../../previousGame/GameInterface.jsx'

const game = props => {
  const { loggedInUser, players, socket } = { ...props }
  const playerRank = players.indexOf(loggedInUser) + 1
  let playerText = `You are Spectating`
  let fullRoom = false
  if (playerRank > 0) playerText = `You are Player ${playerRank}`
  if (players.length === 2)  fullRoom = true
  const interfaceProps = {
    playerRank,
    fullRoom,
    socket
  }
  return (
    <div className='Game'>
      { playerText }
      <GameInterface { ...interfaceProps } />
    </div>
  )
}

export default game