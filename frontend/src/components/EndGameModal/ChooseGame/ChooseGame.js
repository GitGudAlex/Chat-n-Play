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

    const createGame = (gameId) => {
        socket.emit('room:create', { gameTypeId: gameId }, (error) => {
            if(error) {
                $('#endgame-modal-error-output').text(error);

            } else {
                props.resetModal();
            }
        });
    }

    // Wenn ein Spiel neu erstellt wurde -> Dem Spiel beitreten und den anderen mitspielern die neue RoomId mitteilen
    const handleRoomCreatedEvent = useCallback((data) => {
        socket.emit('room:join', { roomId: data.roomId, username: '' }, (error) => {
            if(error) {
                $('#endgame-modal-error-output').text(error);

            }
        });

    }, [socket]);

    // Wenn man einem Spiel gejoint ist -> Lobby laden
    const handleRoomJoinedEvent = useCallback((data) => {
        $('#endgame-modal').modal('hide');
        
        history.push({
            pathname: '/game/lobby/' + data.roomId,
            state: { data: data }
        });

    }, [history]);

    useEffect(() => {
        socket.on('room:created-new', handleRoomCreatedEvent);
        socket.on('room:joined', handleRoomJoinedEvent);

        return () => {
            socket.off('room:created-new');
            socket.off('room:joined', handleRoomJoinedEvent);
        }

    }, [socket, handleRoomCreatedEvent, handleRoomJoinedEvent]);

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
                        <div className='endgame-modal-game' id="ludo" onClick={ () => createGame(0) } >
                        <img src={imgLudo} className="img-game" />
                        </div>
                        <div className='endgame-modal-game' id="uno" onClick={ () => createGame(1) }>
                            <img src={imgKlopfKlopf} className="img-game" />
                        </div>
                        <div className='endgame-modal-game' id="slf" onClick={ () => createGame(2) }>
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
                <p className='endgame-modal-body-text'>Der Host wählt ein Spiel aus</p>
            </div>
            <div id='endgame-modal-footer' className="modal-footer">
                <small id='endgame-modal-error-output' className="text-danger" />
                <button type="button" className="btn btn-primary" onClick={ leaveRoom }>Raum verlassen</button>
            </div>
            <small id='endgame-modal-error-output' className="text-danger" />
        </div>
    );
}

export default ChooseGame;