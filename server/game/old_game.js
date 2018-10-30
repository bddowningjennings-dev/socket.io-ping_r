

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

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
    // init: function () {
    //   this.name = data.name,
    //   this.printName = () => {
    //     console.log('name', this.name)
    //   }
    // },

    
    
    _initializeGame: function (socket) {
        this.count = 0
        this._renderLoop = async (pollOut, gameStatus) => {
          // if (!pollOut) return false
          console.log('looping', this.count)
          // console.log('looping', this.count, io)
          this.gameStatus = gameStatus
          // if (Math.max(this.p1Score, this.p2Score) >= maxScore) {
            //   // endGame();
          //   return
          // };
          // this.player1.color = paddle1Color;
          // this.player2.color = paddle2Color;
          // this.gameBall.color = ballColor;
          // await sleep(10)
          this._ballCollisionY();
          this._userInput();

          // this._userInput(this.player2);
          // ai && this._aiInput(mod);
          // this.frameId = window.requestAnimationFrame(this._renderLoop);
          // console.log(this.gameBall.x)

          // this._renderLoop()
          // return true
        }

        this._ballCollisionY = () => {
          this.count ++
          // console.log('ballcoll')
          // io.emit('send-msg', { msg: 'ballcoll hit', userName: 'server' })
          
          // let room = { msgs: [], players: [], users: [] }
          // console.log('user', user)
          // room.msgs.push(`server: bollcol hit`)


          // if (this.gameBall.x < 580) {
          //   this.gameBall.x = this.gameBall.x + 2
          //   console.log('this gameball', this.gameBall.x)
          //   io.emit('game-canvas-update', this)
          // }


          // io.emit('game-update', { game: this })
          // console.log('other side')


          if (
            this.gameBall.y + this.gameBall.velocityY <= 0 ||
            this.gameBall.y + this.gameBall.velocityY + this.gameBall.height >=
              this.height
          ) {
            this.gameBall.velocityY = this.gameBall.velocityY * -1;
            this.gameBall.x += this.gameBall.velocityX;
            this.gameBall.y += this.gameBall.velocityY;
          } else {
            this.gameBall.x += this.gameBall.velocityX;
            this.gameBall.y += this.gameBall.velocityY;
          }
          this._ballCollisionX();





        }

  // watch ball movement in X dimension and handle paddle collisions and score setting/ball resetting, then call _drawRender
  this._ballCollisionX = () => {
    // const { velocity } = { ...this.props }
    const velocity = 1;
    let hit = 'none';
    if ((this.gameBall.x + this.gameBall.velocityX <=
        this.player1.x + this.player1.width) &&
        (this.gameBall.y + this.gameBall.velocityY > this.player1.y) &&
        (this.gameBall.y + this.gameBall.velocityY <=
          this.player1.y + this.player1.height)) {
            hit = 'player1';
          }
    if ((this.gameBall.x + this.gameBall.width + this.gameBall.velocityX >= this.player2.x) && 
        (this.gameBall.y + this.gameBall.velocityY > this.player2.y) &&
        (this.gameBall.y + this.gameBall.velocityY <= this.player2.y + this.player2.height)) {
            hit = 'player2';
    }
    if (hit !== 'none') {
      this.gameBall.velocityX = this.gameBall.velocityX * -1;
      if (hit === 'player1') {
        if (87 in this.keys) {
          this.gameBall.velocityY -= this.player1.velocityY * 0.25;
        } else if (83 in this.keys) {
          this.gameBall.velocityY += this.player1.velocityY * 0.25;
        }
      } else if (hit === 'player2') {
        if (38 in this.keys) {
          this.gameBall.velocityY -= this.player2.velocityY * 0.25;
        } else if (40 in this.keys) {
          this.gameBall.velocityY += this.player2.velocityY * 0.25;
        }
      }

    } else if (
      this.gameBall.x + this.gameBall.velocityX <
      this.player1.x - this.player1.width
    ) {
      this.p2Score += 1;
      this.gameBall.x = this.width/2;
      this.gameBall.y = this.height/2;
      this.gameBall.velocityX = velocity;
      // this.deadBalls.push(this.gameBall);
      // this.gameBall = new this.GameClasses.Box({
      //   x: this.canvas.width / 2,
      //   y: this.canvas.height / 2,
      //   width: 15,
      //   height: 15,
      //   color: ballColor,
      //   velocityX: velocity,
      //   velocityY: velocity
      // });
    } else if (
      this.gameBall.x + this.gameBall.velocityX >
      this.player2.x + this.player2.width
    ) {
      this.p1Score += 1;
      this.gameBall.x = this.width/2;
      this.gameBall.y = this.height/2;
      this.gameBall.velocityX = -velocity;
      // this.deadBalls.push(this.gameBall);
      // this.gameBall = new this.GameClasses.Box({
      //   x: this.canvas.width / 2,
      //   y: this.canvas.height / 2,
      //   width: 15,
      //   height: 15,
      //   color: ballColor,
      //   velocityX: -velocity,
      //   velocityY: velocity
      // });
    } else {
      this.gameBall.x += this.gameBall.velocityX;
      this.gameBall.y += this.gameBall.velocityY;
    }
    if ((this.turtle.x < this.width + 80 && this.turtle.x > -80) && (this.turtle.y < this.height + 80 && this.turtle.y > -80)) {
      this.turtle.x += this.turtle.velocityX;
      this.turtle.y += this.turtle.velocityY;
    }

    if ((this.turtle.x < this.gameBall.x + this.gameBall.width + 60 && this.turtle.x > this.gameBall.x - 60) && (this.turtle.y < this.gameBall.y + this.gameBall.height + 60 && this.turtle.y > this.gameBall.y - 60)) {
      this.gameBall.velocityX = this.turtle.velocityX;
      this.gameBall.velocityY = this.turtle.velocityY;
      // this.gameBall.x = this.turtle.x;
      // this.gameBall.y = this.turtle.y;
    }

    // this._drawRender();
            io.emit('game-canvas-update', this)

  };






        this._userInput = () => {
          // console.log('userinput')
          // const { ai } = { ...this.props }
          if (87 in this.keys) {
            if (this.player1.y - this.player1.velocityY > 0)
              this.player1.y -= this.player1.velocityY;
          } else if (83 in this.keys) {
            if (
              this.player1.y + this.player1.height + this.player1.velocityY <
              this.height
            )
              this.player1.y += this.player1.velocityY;
          }
          // if (!ai) {
            if (38 in this.keys) {
              if (this.player2.y - this.player2.velocityY > 0)
                this.player2.y -= this.player2.velocityY;
            } else if (40 in this.keys) {
              if (
                this.player2.y + this.player2.height + this.player2.velocityY <
                this.height
              )
                this.player2.y += this.player2.velocityY;
            }
          // }
        }





        const width = 750
        const height = 500
        let size
        if (size === 'large') {
          size = 35
        } else {
          size = 15
        }
        let paddle1Color = '#FFF'
        let paddle2Color = '#FFF'
    
        // initialize canvas element and bind it to our React class
        // this.canvas = this.refs.pong_canvas
        // this.ctx = this.canvas.getContext("2d")
    
        // declare initial variables
        this.p1Score = 0
        this.p2Score = 0
        this.keys = {}
    
        // add keyboard input listeners to handle user interactions
        // window.addEventListener("keydown", e => {
        //   this.keys[e.keyCode] = 1
        //   if (e.target.nodeName !== "INPUT") e.preventDefault()
        // })
        // window.addEventListener("keyup", e => delete this.keys[e.keyCode])
    
        // instantiate our game elements
        this.player1 = new GameClasses.Box({
          x: 10,
          y: 200,
          width: 15,
          height: 80,
          color: paddle1Color,
          velocityY: 2,
        })
        this.player2 = new GameClasses.Box({
          x: 725,
          y: 200,
          width: 15,
          height: 80,
          color: paddle2Color,
          velocityY: 2,
        })
        this.boardDivider = new GameClasses.Box({
          x: width / 2 - 2.5,
          y: -1,
          width: 5,
          height: height + 1,
          color: "#FFF"
        })
        this.gameBall = new GameClasses.Box({
          x: width / 2,
          y: height / 2,
          width: size,
          height: size,
          color: paddle1Color,
          velocityX: 1,
          velocityY: 1,
        })
        this.turtle = new GameClasses.Box({
          x: width + 120,
          y: height + 120,
          width: 12,
          height: 12,
          color: '#8DB86B',
          velocityX: -0.2,
          velocityY: -0.2,
        })
        // start render loop
        this._renderLoop(true, false)
      }
  }
})()








  // // recursively process game state and redraw canvas
  // _renderLoop = () => {
  //   const { maxScore, endGame, paused, ai, level } = { ...this.props }

  //   let mod = 1;
  //   if (level === 'hard') mod = 4;
  //   if (level === 'easy') mod = 0.5;
    
  //   if (paused) return this.frameId = window.requestAnimationFrame(this._renderLoop);
  //   if (Math.max(this.p1Score, this.p2Score) >= maxScore) {
  //     endGame();
  //     return
  //   };
  //   // this.player1.color = paddle1Color;
  //   // this.player2.color = paddle2Color;
  //   // this.gameBall.color = ballColor;
  //   this._ballCollisionY();
  //   this._userInput();
  //   // this._userInput(this.player2);
  //   ai && this._aiInput(mod);
  //   this.frameId = window.requestAnimationFrame(this._renderLoop);
  // };

  // // watch ball movement in Y dimension and handle top/bottom boundary collisions, then call _ballCollisionX
  // _ballCollisionY = () => {
  //   if (
  //     this.gameBall.y + this.gameBall.velocityY <= 0 ||
  //     this.gameBall.y + this.gameBall.velocityY + this.gameBall.height >=
  //       this.canvas.height
  //   ) {
  //     this.gameBall.velocityY = this.gameBall.velocityY * -1;
  //     this.gameBall.x += this.gameBall.velocityX;
  //     this.gameBall.y += this.gameBall.velocityY;
  //   } else {
  //     this.gameBall.x += this.gameBall.velocityX;
  //     this.gameBall.y += this.gameBall.velocityY;
  //   }
  //   this._ballCollisionX();
  // };

  // // watch ball movement in X dimension and handle paddle collisions and score setting/ball resetting, then call _drawRender
  // _ballCollisionX = () => {
  //   const { velocity } = { ...this.props }
  //   let hit = 'none';
  //   if ((this.gameBall.x + this.gameBall.velocityX <=
  //       this.player1.x + this.player1.width) &&
  //       (this.gameBall.y + this.gameBall.velocityY > this.player1.y) &&
  //       (this.gameBall.y + this.gameBall.velocityY <=
  //         this.player1.y + this.player1.height)) {
  //           hit = 'player1';
  //         }
  //   if ((this.gameBall.x + this.gameBall.width + this.gameBall.velocityX >= this.player2.x) && 
  //       (this.gameBall.y + this.gameBall.velocityY > this.player2.y) &&
  //       (this.gameBall.y + this.gameBall.velocityY <= this.player2.y + this.player2.height)) {
  //           hit = 'player2';
  //   }
  //   if (hit !== 'none') {
  //     this.gameBall.velocityX = this.gameBall.velocityX * -1;
  //     if (hit === 'player1') {
  //       if (87 in this.keys) {
  //         this.gameBall.velocityY -= this.player1.velocityY * 0.25;
  //       } else if (83 in this.keys) {
  //         this.gameBall.velocityY += this.player1.velocityY * 0.25;
  //       }
  //     } else if (hit === 'player2') {
  //       if (38 in this.keys) {
  //         this.gameBall.velocityY -= this.player2.velocityY * 0.25;
  //       } else if (40 in this.keys) {
  //         this.gameBall.velocityY += this.player2.velocityY * 0.25;
  //       }
  //     }

  //   } else if (
  //     this.gameBall.x + this.gameBall.velocityX <
  //     this.player1.x - this.player1.width
  //   ) {
  //     this.p2Score += 1;
  //     this.gameBall.x = this.canvas.width/2;
  //     this.gameBall.y = this.canvas.height/2;
  //     this.gameBall.velocityX = velocity;
  //     // this.deadBalls.push(this.gameBall);
  //     // this.gameBall = new this.GameClasses.Box({
  //     //   x: this.canvas.width / 2,
  //     //   y: this.canvas.height / 2,
  //     //   width: 15,
  //     //   height: 15,
  //     //   color: ballColor,
  //     //   velocityX: velocity,
  //     //   velocityY: velocity
  //     // });
  //   } else if (
  //     this.gameBall.x + this.gameBall.velocityX >
  //     this.player2.x + this.player2.width
  //   ) {
  //     this.p1Score += 1;
  //     this.gameBall.x = this.canvas.width/2;
  //     this.gameBall.y = this.canvas.height/2;
  //     this.gameBall.velocityX = -velocity;
  //     // this.deadBalls.push(this.gameBall);
  //     // this.gameBall = new this.GameClasses.Box({
  //     //   x: this.canvas.width / 2,
  //     //   y: this.canvas.height / 2,
  //     //   width: 15,
  //     //   height: 15,
  //     //   color: ballColor,
  //     //   velocityX: -velocity,
  //     //   velocityY: velocity
  //     // });
  //   } else {
  //     this.gameBall.x += this.gameBall.velocityX;
  //     this.gameBall.y += this.gameBall.velocityY;
  //   }
  //   if ((this.turtle.x < this.canvas.width + 80 && this.turtle.x > -80) && (this.turtle.y < this.canvas.height + 80 && this.turtle.y > -80)) {
  //     this.turtle.x += this.turtle.velocityX;
  //     this.turtle.y += this.turtle.velocityY;
  //   }

  //   if ((this.turtle.x < this.gameBall.x + this.gameBall.width + 60 && this.turtle.x > this.gameBall.x - 60) && (this.turtle.y < this.gameBall.y + this.gameBall.height + 60 && this.turtle.y > this.gameBall.y - 60)) {
  //     this.gameBall.velocityX = this.turtle.velocityX;
  //     this.gameBall.velocityY = this.turtle.velocityY;
  //     // this.gameBall.x = this.turtle.x;
  //     // this.gameBall.y = this.turtle.y;
  //   }

  //   this._drawRender();
  // };