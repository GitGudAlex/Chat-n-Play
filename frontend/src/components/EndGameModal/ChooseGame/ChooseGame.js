import { useContext } from 'react';
import $ from 'jquery';

import './ChooseGame.css';

import SocketContext from "../../../services/socket";
import { useHistory } from 'react-router';

function ChooseGame(props) {

    // Socket 
    const socket = useContext(SocketContext);

    // Router Stuff
    const history = useHistory();

    // Spiel verlassen
    const leaveRoom = () => {
        $('#endgame-modal').modal('hide');

        socket.emit('room:leave-room');
        history.push('/');

    }

    const createGame = (gameId) => {

    }

    // Spieler ist host
    if(props.isHost) {
        return (
            <div id='endgame-modal-content' className="modal-content">
                <div id='endgame-modal-header' className="modal-header text-center">
                    <p id='endgame-modal-title' className="modal-title w-100">Neues Spiel</p>
                </div>
                <div id='endgame-modal-body' className="modal-body text-center">
                    <p className='endgame-modal-body-text w-100'>Wähle ein Spiel aus:</p>
                    <div className='endgame-modal-games-list'>
                        <div className='endgame-modal-game' onClick={ () => createGame(0) } >
                            <p>Ludo</p>
                        </div>
                        <div className='endgame-modal-game' onClick={ () => createGame(1) }>
                            <p>Uno</p>
                        </div>
                        <div className='endgame-modal-game' onClick={ () => createGame(2) }>
                            <p>Stadt, Land, Fluss</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Spieler ist kein Host
    return (
        <div id='endgame-modal-content' className="modal-content">
            <div id='endgame-modal-header' className="modal-header text-center">
                <p id='endgame-modal-title' className="modal-title w-100">Neues Spiel</p>
            </div>
            <div id='endgame-modal-body' className="modal-body  text-center">
                <p className='endgame-modal-body-text'>Der Host wählt ein Spiel aus</p>
            </div>
            <div id='endgame-modal-footer' className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={ leaveRoom }>Raum verlassen</button>
            </div>
        </div>
    );
}

export default ChooseGame;