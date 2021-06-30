import { useCallback, useContext, useEffect } from 'react';
import $ from 'jquery';

import './ChooseGame.css';

import SocketContext from "../../../services/socket";
import { useHistory } from 'react-router';

import imgLudo from '../../../img/Ludo.png'
import imgKlopfKlopf from '../../../img/KlopfKlopf.png'
import imgSLF from '../../../img/SLF.png'

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

    const changeGame = (gameId) => {
        socket.emit('room:changing-game', { gameTypeId: gameId });
    }

    // Wenn man einem Spiel gejoint ist -> Lobby laden
    const handleHameChangedEvent = useCallback((data) => {
        $('#endgame-modal').modal('hide');

        props.resetModal();
        
        history.push({
            pathname: '/game/lobby/' + data.roomId,
            state: { data: data }
        });

    }, [history, props]);

    useEffect(() => {
        socket.on('room:game-changed', handleHameChangedEvent);

        return () => {
            socket.off('room:game-changed', handleHameChangedEvent);
        }

    }, [socket, handleHameChangedEvent]);

    // Spieler ist host
    if(props.isHost) {
        return (
            <div id='endgame-modal-content' className="modal-content">
                <div id='endgame-modal-header' className="modal-header text-center">
                    <p id='endgame-modal-title' className="modal-title w-100">Wähle ein neues Spiel aus</p>
                </div>
                <div id='endgame-modal-body' className="modal-body text-center">
                    <div className='endgame-modal-games-list'>
                        <div className='endgame-modal-game' id="ludo" onClick={ () => changeGame(0) } >
                        <img src={imgLudo} className="img-game" />
                        </div>
                        <div className='endgame-modal-game' id="uno" onClick={ () => changeGame(1) }>
                            <img src={imgKlopfKlopf} className="img-game" />
                        </div>
                        <div className='endgame-modal-game' id="slf" onClick={ () => changeGame(2) }>
                            <img src={imgSLF} className="img-game"/>
                        </div>
                    </div>
                    <small id='endgame-modal-error-output' className="text-danger" />
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
                <p className='endgame-modal-body-text'>Der*Die Host wählt ein Spiel aus.</p>
            </div>
            <div id='endgame-modal-footer' className="modal-footer">
                <small id='endgame-modal-error-output' className="text-danger" />
                <button type="button" className="btn btn-dark" onClick={ leaveRoom }>Raum verlassen</button>
            </div>
            <small id='endgame-modal-error-output' className="text-danger" />
        </div>
    );
}

export default ChooseGame;