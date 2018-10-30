import React, { Component } from 'react'

import './GameCanvas.css'

// import io from 'socket.io-client'
// const socket = io('http://localhost:8000')

const initializeState = props => {
  return {
    key: 'up',
  }
}

class NewCanvas extends Component {
  constructor(props) {
    super(props)
    this.state = initializeState(this.props)
    this.socket = this.props.socket
  }
  componentDidMount() {
    this._initializeGameCanvas()
    this.socket.on('game-canvas-update', game => {
      // console.log('game-canvas-update', game)
      const _renderLoop = () => {
        this._drawRender(game)
      }
      this.frameId = window.requestAnimationFrame(_renderLoop)

    })
    document.addEventListener('keydown', this._handleKeyDown)
    document.addEventListener('keyup', this._handleKeyUp)
  }
  componentWillUnmount() {
    this.socket.off('game-canvas-update')
    document.removeEventListener('keydown', this._handleKeyDown)
    document.removeEventListener('keyup', this._handleKeyUp)
  }

  componentDidUpdate(prevProps) {
    const { running } = { ...this.props }
    // console.log('running', running)
    if (prevProps.running !== running) {
      if (running) {
        // this._initializeGameCanvas()
        // this.pollData(running)
      }
    }
  }
  _handleKeyDown = e => {
    const { keyCode } = e
    const { playerRank } = { ...this.props }
    const { key } = { ...this.state }
    if (!playerRank) return
    if ([38, 40].includes(keyCode)) {
      e.preventDefault()
      if (key === 'up') {
        this.setState({ key: 'down' }, () => {
          // console.log('emit down', playerRank, keyCode)
          this.socket.emit(`key-down`, { player: playerRank, keyCode })
        })
      }
    }
  }
  _handleKeyUp = e => {
    const { keyCode } = e
    const { playerRank } = { ...this.props }
    const { key } = { ...this.state }
    if (!playerRank) return
    if ([38, 40].includes(keyCode)) {
      e.preventDefault()
      if (key === 'down') {
        this.setState({ key: 'up' }, () => {
          // console.log('emit up', playerRank, keyCode)
          this.socket.emit(`key-up`, { player: playerRank, keyCode })
        })
      }
    }
  }
  _initializeGameCanvas = () => {
    this.canvas = this.refs.pong_canvas
    this.ctx = this.canvas.getContext("2d")
  }

  // clear canvas and redraw according to new game state
  _drawRender = game => {
    const { playerRank } = { ...this.props }
    if (!game) return
    if (!this.ctx) return console.log('no this.ctx')

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this._displayScore1(game)
    this._displayScore2(game)
    this._drawBox(game.boardDivider)
    this._drawBox(game.gameBall)
    this._drawBox(game.player1)
    this._drawBox(game.player2)
    this._drawBox(game.turtle)
    const timeDiff = new Date().getTime() - game.startTime
    console.log('ball', game.gameBall.x, game.gameBall.y, timeDiff)
    if (playerRank === 1) {
      this.socket.emit('poll-game', '')
    }
  }

  // take in game object and draw to canvas
  _drawBox = box => {
    this.ctx.fillStyle = box.color
    this.ctx.fillRect(box.x, box.y, box.width, box.height)
  }

  // render player 1 score
  _displayScore1 = game => {
    this.ctx.font = "20px Arial"
    this.ctx.fillStyle = "rgb(255, 255, 255)"
    this.ctx.fillText(
      game.p1Score,
      this.canvas.width / 2 - (game.p1Score > 9 ? 55 : 45),
      30
    )
  }

  // render player 2 score
  _displayScore2 = game => {
    this.ctx.font = "20px Arial"
    this.ctx.fillStyle = "rgb(255, 255, 255)"
    this.ctx.fillText(game.p2Score, this.canvas.width / 2 + 33, 30)
  }

  render() {
    // const { running } = { ...this.props }
    // const { turtlesAllTheWayDown } = { ...this.state }
    // const Aux = props => props.children
    // let buttons
    // let launchTurtleText = turtlesAllTheWayDown ? 'Send the Gravity Turtle Away on an Errand' : 'Launch the Gravity Turtle'
    // if (running) {
    //   buttons = (
    //     <Aux>
    //       <button onClick={this.resetData}>Reset Paddles and Ball</button>
    //       <button onClick={this.toggleTurtlesAllTheWayDown}>{launchTurtleText}</button>
    //     </Aux>
    //   )
    // }
    return (
      <div className='GameCanvas'>
        <canvas
          id="pong_canvas"
          ref="pong_canvas"
          width="750"
          height="500"
          style={{ background: "#12260e", border: "4px solid #FFF" }}
        />
        {/* { buttons } */}
      </div>
    )
  }
}

export default NewCanvas
