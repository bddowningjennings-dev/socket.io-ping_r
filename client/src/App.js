import React, { Component } from 'react'
import './App.css'
import io from 'socket.io-client'

import Header from './Layout/Header/Header'
import Main from './Layout/Main/Main'

const initializeState = props => ({
  isLoggedIn: false,
  userName: '',
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = initializeState(this.props)
    this.socket = io('http://localhost:8000')
  }
  componentDidMount() {
    const userName = localStorage.getItem('userName')
    if (userName) {
      this.setState({ userName, isLoggedIn: true },
        () => { this.socket.emit('login-refresh', userName) }
      )
    }
  }
  setUser = (userName, isLoggedIn) => this.setState({ userName, isLoggedIn })
  handleLogout = e => {
    e && e.preventDefault()
    const { userName } = { ...this.state }
    this.setState(prevState => ({ ...initializeState(this.props) }),
      () => {
        localStorage.removeItem('userName')
        this.socket.emit('logout', userName)
      }
    )
  }
  render() {
    const { userName, isLoggedIn } = { ...this.state }
    const headerProps = {
      userName,
      handleLogout: this.handleLogout,
    }
    const mainProps = {
      userName,
      isLoggedIn,
      socket: this.socket,
      setUser: this.setUser,
    }
    return (    
      <div className="App">
        <Header { ...headerProps }/>
        <Main { ...mainProps } />
      </div>
    )
  }
}

export default App
