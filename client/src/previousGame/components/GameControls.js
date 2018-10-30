import React, { Component } from 'react';

import './GameControls.css'

class GameControls extends Component {
    render() {

        // const { startGame, setColor, paused } = { ...this.props }
        // const { paddle1Color, paddle2Color, ballColor } = { ...this.props }
        const { startGame, running } = { ...this.props }

        // const pauseText = paused ? 'Resume Game' : 'Pause Game'
        const setup = (
            <div className='setup'>
                {/* <div onClick={()=>this.player1Color.click()} >
                    Set Player1 Paddle Color:
                    <div className='color-selected' style={{'backgroundColor':`${paddle1Color}`}}></div>
                    <input
                        className='hidden'
                        ref={input => this.player1Color = input}
                        onChange={setColor} 
                        type="color"
                        name="paddle1Color"
                    />
                </div>
                <div onClick={()=>this.player2Color.click()}>
                    Set Player2 Paddle Color:
                    <div className='color-selected' style={{'backgroundColor':`${paddle2Color}`}}></div>
                    <input
                        className='hidden'
                        onChange={setColor}
                        ref={input => this.player2Color = input}
                        type="color"
                        name="paddle2Color"
                    />
                </div>
                <div onClick={()=>this.ballColor.click()}>
                    Set Ball Color:
                    <div className='color-selected' style={{'backgroundColor':`${ballColor}`}}></div>
                    <input
                        className='hidden'
                        onChange={setColor}
                        ref={input => this.ballColor = input}
                        type="color"
                        name="ballColor"
                    />
                </div> */}
                <button className='start-btn' onClick={startGame}>Start Game</button>
            </div>
        )
        return (
            <article className='GameControls'>
                { !running && setup }
                {/* { running && <button className='pause-btn' onClick={togglePause}>{pauseText}</button>} */}
                
            </article>
        )
    }
}

export default GameControls;