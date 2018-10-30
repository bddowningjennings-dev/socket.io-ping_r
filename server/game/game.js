

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const GameClasses = (() => {
  return {
    Box: function Box(opts) {
      let { x, y, width, height, color, velocityX, velocityY } = opts
      this.x = x || 10
      this.y = y || 10
      this.width = width || 40
      this.height = height || 50
      this.color = color || "#FFF"
      this.velocityX = velocityX || 2
      this.velocityY = velocityY || 2
    }
  }
})()

module.exports = io => (() => {
  return {
    _initializeGame: function (socket) {
      this.height = 500
      this.width = 750
      this.count = 0

      this._renderLoop = () => {
        console.log('looping', this.count)
        if (Math.max(this.p1Score, this.p2Score) >= 5) {
          // endGame()
          return
        }
        this._userInput()
        this._ballCollisionY()
      }

      this._ballCollisionY = () => {
        this.count ++
        if ( this.gameBall.y + this.gameBall.velocityY <= 0 || this.gameBall.y + this.gameBall.velocityY + this.gameBall.height >= this.height ) {
          this.gameBall.velocityY = this.gameBall.velocityY * -1
          this.gameBall.x += this.gameBall.velocityX
          this.gameBall.y += this.gameBall.velocityY
        } else {
          this.gameBall.x += this.gameBall.velocityX
          this.gameBall.y += this.gameBall.velocityY
        }
        this._ballCollisionX()
      }

      // watch ball movement in X dimension and handle paddle collisions and score setting/ball resetting, then call _drawRender
      this._ballCollisionX = () => {
        const velocity = 3
        let hit = 'none'
        if ((this.gameBall.x + this.gameBall.velocityX <=
          this.player1.x + this.player1.width) &&
          (this.gameBall.y + this.gameBall.velocityY > this.player1.y) &&
          (this.gameBall.y + this.gameBall.velocityY <=
            this.player1.y + this.player1.height)) {
              hit = 'player1'
            }
        if ((this.gameBall.x + this.gameBall.width + this.gameBall.velocityX >= this.player2.x) && 
            (this.gameBall.y + this.gameBall.velocityY > this.player2.y) &&
            (this.gameBall.y + this.gameBall.velocityY <= this.player2.y + this.player2.height)) {
                hit = 'player2'
        }
        if (hit !== 'none') {
          this.gameBall.velocityX = this.gameBall.velocityX * -1
        } else if (
          this.gameBall.x + this.gameBall.velocityX <
          this.player1.x - this.player1.width
        ) {
          this.p2Score += 1
          this.gameBall.x = this.width/2
          this.gameBall.y = this.height/2
          this.gameBall.velocityX = velocity
        } else if (
          this.gameBall.x + this.gameBall.velocityX >
          this.player2.x + this.player2.width
        ) {
          this.p1Score += 1
          this.gameBall.x = this.width/2
          this.gameBall.y = this.height/2
          this.gameBall.velocityX = -velocity
        } else {
          this.gameBall.x += this.gameBall.velocityX
          this.gameBall.y += this.gameBall.velocityY
        }

    // this._drawRender()

    this.startTime = new Date().getTime()
    // console.log(game.startTime)
      io.emit('game-canvas-update', this)

      }






      this._userInput = () => {
        if (87 in this.keys) {
          if (this.player1.y - this.player1.velocityY > 0)
            this.player1.y -= this.player1.velocityY
        } else if (83 in this.keys) {
          if (
            this.player1.y + this.player1.height + this.player1.velocityY <
            this.height
          )
            this.player1.y += this.player1.velocityY
        }
        if (38 in this.keys) {
          if (this.player2.y - this.player2.velocityY > 0)
            this.player2.y -= this.player2.velocityY
        } else if (40 in this.keys) {
          if (
            this.player2.y + this.player2.height + this.player2.velocityY <
            this.height
          )
            this.player2.y += this.player2.velocityY
        }
      }




      let size = 15
      let paddle1Color = '#FFF'
      let paddle2Color = '#FFF'
  
      // declare initial variables
      this.p1Score = 0
      this.p2Score = 0
      this.keys = {}
  
      // instantiate our game elements
      this.player1 = new GameClasses.Box({
        x: 10,
        y: 200,
        width: 15,
        height: 80,
        color: paddle1Color,
        velocityY: 6,
        // velocityY: 2,
      })
      this.player2 = new GameClasses.Box({
        x: 725,
        y: 200,
        width: 15,
        height: 80,
        color: paddle2Color,
        velocityY: 6,
        // velocityY: 2,
      })
      this.boardDivider = new GameClasses.Box({
        x: this.width / 2 - 2.5,
        y: -1,
        width: 5,
        height: this.height + 1,
        color: "#FFF"
      })
      this.gameBall = new GameClasses.Box({
        x: this.width / 2,
        y: this.height / 2,
        width: size,
        height: size,
        color: paddle1Color,
        velocityX: 3,
        velocityY: 3,
      })
      this.turtle = new GameClasses.Box({
        x: this.width + 120,
        y: this.height + 120,
        width: 12,
        height: 12,
        color: '#8DB86B',
        velocityX: -0.2,
        velocityY: -0.2,
      })
      // start render loop
      this._renderLoop()
    }
  }
})()


