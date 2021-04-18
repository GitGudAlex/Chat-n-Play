import { useContext } from 'react';
import { useHistory, useLocation } from "react-router-dom";

import './Game.css';

import Lobby from "./Lobby/Lobby";
import SocketContext from '../../services/socket';

function Game() {

    // Router Stuff
    const history = useHistory();
    const location = useLocation();

    // Socket.io
    const socket = useContext(SocketContext);

    // Schauen, ob man sich überhaupt in einem Raum befindet 
    socket.emit('room:is-in-room', (isInRoom) => {
        if(!isInRoom) {
            history.push('/');

        }
    });

    let gameWindow;

    if(location.state === undefined) {
        gameWindow = <div></div>

    } else {
        gameWindow = <Lobby data={ location.state.data }/>

    }

    return (
        <div className='container-fluid'>
            <div className="row">
                <div id='game-wrapper' className="col">
                    { gameWindow }
                </div>
            </div>
        </div>
    );
}

export default Game;
