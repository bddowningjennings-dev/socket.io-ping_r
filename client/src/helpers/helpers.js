

const gameSockets = ({ socket, listenerCallback: cb }) => {
  return {
    add: () => {
      socket.on('game-update', cb)
    },
    remove: () => {
      socket.off('game-update')
    }
  }
}

const roomSockets = ({ socket, listenerCallback: cb }) => {
  return {
    add: () => {
      socket.on('room-update', cb)
      socket.on('user-connected', cb)
      socket.on('msg', cb)
    },
    remove: () => {
      socket.off('room-update')
      socket.off('user-connected')
      socket.off('msg')
    }
  }
}

export {
  gameSockets,
  roomSockets,
}
