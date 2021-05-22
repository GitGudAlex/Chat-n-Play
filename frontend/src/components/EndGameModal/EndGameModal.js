import { useCallback, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';
import $ from 'jquery';
import SocketContext from "../../services/socket";

import './EndGameModal.css';

import WinnerDisplay from './WinnerDisplay/WinnerDisplay';
import ChooseGame from './ChooseGame/ChooseGame';

function EndGameModal(props) {

    // Socket 
    const socket = useContext(SocketContext);

    // Router Stuff
    const history = useHistory();

    const [endGameStatus, setEndGameStatus] = useState(0);

    // Wenn der Raum geschlossen wird
    const handleCloseRoomEvent = useCallback(() => {
        $('#endgame-modal').modal('hide');
        
        // Zur Startseite
        history.push('/');

    }, [history]);

    // Wenn der Host ein neues Spiel erstellt hat
    const handleNewRoomEvent = useCallback(() => {
        
        // Modal Content ändern
        setEndGameStatus(1);
    }, []);

    useEffect(() => {
        socket.on('room:room-closed', handleCloseRoomEvent);
        socket.on('room:new-room-created', handleNewRoomEvent);

        return() => {
            socket.off('room:room-closed');
            socket.off('room:new-room-created');
        }
    }, [socket, handleCloseRoomEvent, handleNewRoomEvent]);

    let modalContent;

    if(endGameStatus === 0) {
        modalContent = <WinnerDisplay winners={ props.winners } isHost={ props.isHost } />

    } else {
        modalContent = <ChooseGame isHost={ props.isHost } />
    }

    return (
        <div className="modal fade" id="endgame-modal" tabIndex="-1" role="dialog" aria-hidden="true">
            <div id='endgame-modal-dialog' className="modal-dialog modal-dialog-centered modal-lg" role="document">
                { modalContent }
            </div>
        </div>
    );
}

export default EndGameModal;