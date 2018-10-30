

module.exports = server => {
  const io = require('socket.io')(server)
  const GameController = require('../game/game')(io)
  let game
  let room = {
    msgs: [],
    users: [],
    players: [],
  }
  let pollOut = true
  
  const handleSocket = socket => {
    io.emit('user-connected', { room })
    let user

    socket.on('disconnect', () => {
      if (user) {
        // room = { ...room, users: room.users.filter(name => name !== user) }
        io.emit('disconnect-msg', { msg: `${user} disconnected`, room })
        // io.emit('user-disconnected', { msg: `${user} disconnected`, room })
      } else {
        // io.emit('msg', { msg: 'disconnected' })
        // io.emit('user-disconnected', { msg: 'disconnected' })
      }
    })

    socket.on('player-login', userName => {
      user = userName
      // console.log('login happentttt for', userName)
      room.players.push(userName)
      room.users.push(userName)
      io.emit('room-update', { room })
      // io.emit('msg', { msg: `${userName} added` })
      // check for userName conflict/use restFul routes for login
    })

    socket.on('spectator-login', userName => {
      user = userName
      // console.log('login happentttt for', userName)
      room.users.push(userName)
      io.emit('room-update', { room })
      // io.emit('msg', { msg: `${userName} added` })
      // check for userName conflict/use restFul routes for login
    })

    socket.on('login-refresh', userName => {
      user = userName
      io.emit('room-update', { room })
      // console.log('refresh happentttt for', userName)
    })

    socket.on('logout', userName => {
      console.log('logout happentttt for', userName)
      user = ''
      console.log(user)
      room = { 
        ...room,
        players: room.players.filter(name => name !== userName),
        users: room.users.filter(name => name !== userName)
      } 
      io.emit('room-update', { room })
    })

    socket.on('send-msg', data => {
      const { msg, userName } = data
      if (userName) room.msgs.push(`${userName}: ${msg}`)
      if (!userName) room.msgs.push(`anon: ${msg}`)
      io.emit('room-update', { room })
    })


    socket.on('key-down', data => {
      const { player, keyCode } = data
      // console.log('down player', player, keyCode)
      if (player === 1 && keyCode === 38) game.keys[87] = 1
      if (player === 1 && keyCode === 40) game.keys[83] = 1
      if (player === 2 && keyCode === 38) game.keys[38] = 1
      if (player === 2 && keyCode === 40) game.keys[40] = 1

    })


    socket.on('key-up', data => {
      const { player, keyCode } = data
      // console.log('up player', player, keyCode)
      if (player === 1 && keyCode === 38) delete game.keys[87]
      if (player === 1 && keyCode === 40) delete game.keys[83]
      if (player === 2 && keyCode === 38) delete game.keys[38]
      if (player === 2 && keyCode === 40) delete game.keys[40]

    })


    socket.on('_initiate-game', () => {
      game = new GameController._initializeGame(socket)
    })

    socket.on('poll-game', () => {
      game._renderLoop()
    })

  }

  io.on('connection', handleSocket)
}

