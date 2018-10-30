import React from 'react'
import './Header.css'

const header = props => {
  const { userName, handleLogout } = props
  return (
    <header className='Header'>
      <span className='title'>Ping_r</span>
      { userName && userName }
      { userName && (<button onClick={handleLogout}>Logout</button>) }
    </header>
  )
}

export default header
