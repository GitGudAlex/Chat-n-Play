import { useContext, useEffect, useCallback, useRef } from 'react';
import { useHistory } from "react-router-dom";
import $ from 'jquery';

import StartGame from './StartGame/StartGame';
import InvitationCopyBoards from './InvitationCopyBoards/InvitationCopyBoards';
import ColorSelector from './ColorSelector/ColorSelector';

import SocketContext from '../../services/socket';

function Lobby(props) {

    // Router Stuff
    const history = useHistory();

    // Socket.io
    const socket = useContext(SocketContext);

    // Nur auf die Hauptseite, wenn man den zurück button benutzt. Wenn man jedoch
    // Zum Spiel weitergeleitet wird, würde auch das 'zurück' Event ausgelöst werden
    // Diese Variable verhindert das
    const hasStarted = useRef(false);

    // Wenn das Spiel gestarted wurde
    const handleGameStartedEvent = useCallback((data) => {
        hasStarted.current = true;

        history.push({
            pathname: '/game' + data.route,
            state: {
                gameId: props.gameId
            }
        });


    }, [history, props.gameId]);

    // Socket Events
    useEffect(() => {
        $('.invitation-button').height($('.invitation-button').width());

        socket.on('room:game-started', handleGameStartedEvent);

        return () => {
            // Events unmounten
            socket.off('room:game-started');
        };

    }, [socket, handleGameStartedEvent]);

    useEffect(() => { 
        return () => {
            // Nur aus dem Raum raus gehen, wenmn man auch wirklich zurück geht
            if(!hasStarted.current) {
                // Wenn man in der Browser historie zurück geht, soll man aus dem Spiel fliegen
                socket.emit('room:leave-room');
            }
        }
    }, [socket, history])

    return (
        <div id='game-content'>
            <ColorSelector />
            <StartGame hostId={ props.hostId } />
            <InvitationCopyBoards roomId={ props.roomId } />
        </div>
    );
}

export default Lobby;