import React, { Component } from 'react'
import './GameInterface.css'

import NewCanvas from './components/NewCanvas'
import GameControls from './components/GameControls'

import { gameSockets } from '../helpers/helpers'

const initializeState = props => {
  return {
    paddle1Color: '#FFF',
    paddle2Color: '#FFF',
    ballColor: '#FFF',
  }
}

class GameInterface extends Component {
  constructor(props) {
    super(props)
    this.state = initializeState(this.props)
    this.socket = this.props.socket
    this.gameSockets = gameSockets({
      socket: this.socket,
      listenerCallback: this.stateChangeingCallback,
    })
  }
  componentDidMount() {
    // this.gameSockets.add()
  }
  componentWillUnmount() {
    // this.gameSockets.remove()
  }

  stateChangeingCallback = data => {
    let newData = data
    this.setState(prevState => {
    const { msg } = { ...data }
    if (msg) {
      newData = {
        ...data,
        room: {
          ...prevState.room,
          msgs: [ ...prevState.room.msgs, msg ]
        }
      }
    }
    return { ...prevState, ...newData }
    }, () => {})
  }
  startGame = () => {
    this.socket.emit('_initiate-game', {})
    this.setState(prevState => ({ ...prevState, running: true }))
  }
  setColor = e => {
    e && e.preventDefault()
    const { target } = { ...e }
    this.setState(prevState => ({ ...prevState, [target.name]: target.value }))
  }
  render() {
    const { fullRoom, socket, playerRank } = { ...this.props }
    const { game } = { ...this.state }
    const { paddle1Color, paddle2Color, ballColor, ballType } = { ...this.state }
    const { running, paused, errorMsgs } = { ...this.state }
    const gameCanvasProps = {
      game,
      socket,
      running,
      paddle1Color,
      paddle2Color,
      ballColor,
      playerRank,
      endGame: this.endGame,
    }
    const gameControlsProps = {
      running,
      paused,
      paddle1Color,
      paddle2Color,
      ballColor,
      ballType,
      errorMsgs,
      toggleAI: this.toggleAI,
      passState: this.setSelectInput,
      startGame: this.startGame,
      togglePause: this.togglePause,
      setValue: this.setValue,
      setColor: this.setColor,
    }
    let controlsContent = 'Waiting for another player...'
    if (fullRoom) controlsContent = (
      <GameControls {...gameControlsProps} />
    )

    return (
      <main>
        <section>
          <NewCanvas {...gameCanvasProps} />
          { controlsContent  }
        </section>
      </main>
    )
  }
}

export default GameInterface