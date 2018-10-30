import React, { Component } from 'react';
import './GameInterface.css'

import NewCanvas from './components/NewCanvas';
import GameControls from './components/GameControls';

import io from 'socket.io-client'
import { gameSockets } from '../helpers/helpers'

const socket = io('http://localhost:8000')

const initializeState = props => {
    return {
        paddle1Color: '#FFF',
        paddle2Color: '#FFF',
        ballColor: '#FFF',
    }
}

class GameInterface extends Component {
    constructor(props) {
        super(props);
        this.state = initializeState(this.props)
        this.gameSockets = gameSockets({ socket, listenerCallback: this.stateChangeingCallback })
    }
    componentDidMount() {
        this.gameSockets.add()
    }
    componentWillUnmount() {
        this.gameSockets.remove()
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
        socket.emit('_initiate-game', { thing: 'test' })
        // this.setState(prevState => ({ ...prevState, running: true }));
    }
    setColor = e => {
        e && e.preventDefault();
        const { target } = { ...e };
        this.setState(prevState => ({ ...prevState, [target.name]: target.value }));
    }
    render() {
        const { paddle1Color, paddle2Color, ballColor, ballType } = { ...this.state };
        const { running, paused, errorMsgs } = { ...this.state };
        const gameCanvasProps = {
            paddle1Color,
            paddle2Color,
            ballColor,
            endGame: this.endGame,
        };
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
        };

        return (
            <main>
                <section>
                    <NewCanvas {...gameCanvasProps} />
                    {/* <GameCanvas {...gameCanvasProps} /> */}
                    <GameControls {...gameControlsProps} />
                </section>
            </main>
        )
    }
}

export default GameInterface;