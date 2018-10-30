import React, { Component } from 'react'
import './Main.css'
// import io from 'socket.io-client'

import Room from '../../components/Room/Room'
import Login from '../../components/Login/Login'
import Game from '../../components/Game/Game'

import { roomSockets } from '../../helpers/helpers'

const initializeState = props => {
  return {
    // isLoggedIn: false,
    userName: '',
    msg: '',
    room: {
      players: [],
      users: [],
      msgs: [],
    },
  }
}

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = initializeState(this.props)
    this.socket = this.props.socket
    this.roomSockets = roomSockets({
      socket: this.socket,
      listenerCallback: this.stateChangeingCallback
    })
  }
  componentDidMount() {
    this.roomSockets.add()
    // const userName = localStorage.getItem('userName')
    // if (userName) {
    //   this.setState({ userName, isLoggedIn: true },
    //     () => { this.socket.emit('login-refresh', userName) }
    //   )
    // }
  }
  componentWillUnmount() {
    this.roomSockets.remove()
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
  handleChange = e => {
    e && e.preventDefault()
    const { target: { name, value } } = { ...e }
    this.setState(prevState => ({ ...prevState, [name]: value }))
  }
  handleSpectatorLogin = e => {
    e && e.preventDefault()
    const { userName } = { ...this.state }
    const { setUser, isLoggedIn } = { ...this.props }
    if (!userName) return alert('Need to provide a user name')
    setUser(userName, !isLoggedIn)
    localStorage.setItem('userName', userName)
    this.socket.emit('spectator-login', userName)
    this.setState(prevState => ({ ...prevState, userName: '' }),
    () => {
      }
    )
  }
  handlePlayerLogin = e => {
    e && e.preventDefault()
    const { userName } = { ...this.state }
    const { setUser, isLoggedIn } = { ...this.props }
    if (!userName) return alert('Need to provide a user name')
    setUser(userName, !isLoggedIn)
    localStorage.setItem('userName', userName)
    this.socket.emit('player-login', userName)
    this.setState(prevState => ({ ...prevState, userName: '' }),
      () => {
        // const { userName } = { ...this.state }
      }
    )
  }
  handleMsgSubmit = e => {
    e && e.preventDefault()
    const { msg } = { ...this.state }
    const { userName } = { ...this.props }
    this.setState(prevState => ({ ...prevState, msg: '' }))
    this.socket.emit('send-msg', { msg, userName })
  }
  // handleLogout = e => {
  //   e && e.preventDefault()
  //   const { userName } = { ...this.state }
  //   this.setState(prevState => ({ ...initializeState(this.props) }),
  //     () => {
  //       localStorage.removeItem('userName')
  //       this.socket.emit('logout', userName)
  //     }
  //   )
  // }
  render() {
    const { userName, room: roomObj, msg } = { ...this.state }
    const { isLoggedIn, userName: loggedInUser, socket } = { ...this.props }
    const { users, players } = roomObj
    const roomProps = {
      msg,
      roomObj,
      handleChange: this.handleChange,
      handleMsgSubmit: this.handleMsgSubmit,
    }
    const loginProps = {
      userName,
      players,
      users,
      handleChange: this.handleChange,
      handleSpectatorLogin: this.handleSpectatorLogin,
      handlePlayerLogin: this.handlePlayerLogin,
    }
    const gameProps = {
      loggedInUser,
      players,
      socket,
      // handleLogout: this.handleLogout,
    }
    let content = (<Login {...loginProps} />)
    if (isLoggedIn) content = (
      <Game {...gameProps} />
    )
    return (    
      <div className="Main">
        { content }
        <Room { ...roomProps }/>
      </div>
    )
  }
}

export default Main
