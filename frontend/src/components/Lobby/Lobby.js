import { useContext, useEffect, useCallback } from 'react';
import { useHistory } from "react-router-dom";
import $ from 'jquery';

import StartGame from './StartGame/StartGame';
import InvitationCopyBoards from './InvitationCopyBoards/InvitationCopyBoards';
import ColorSelector from './ColorSelector/ColorSelector';

import lobbyblue from '../../img/background_lobby_blue.png';
import lobbyred from '../../img/background_lobby.png';
import lobbygreen from '../../img/background_lobby_green.png';

import './Lobby.css'

import SocketContext from '../../services/socket';

function Lobby(props) {

    // Router Stuff
    const history = useHistory();

    // Socket.io
    const socket = useContext(SocketContext);

    // Wenn das Spiel gestarted wurde
    const handleGameStartedEvent = useCallback((data) => {

    //$('#game-content-wrapper').css({backgroundImage: 'url (../../img/background_9.png)'});

        history.push({
            pathname: '/game' + data.route,
            state: {
                gameId: props.gameId
            }
        });


    }, [history, props.gameId]);

    // Sets the background image
    //const setBackground = (image) => {
        
   // $("#game-wrapper-content").css({backgroundImage: lobbyred})
    //    if (id = 0) {
     //       setBackground(lobbyred);
    //    } else if (id = 1) {
    //        setBackground(lobbygreen);
     //   } else {
     //       setBackground(lobbyblue);
     //    }

        
   // }

    // Socket Events
    useEffect(() => {
        $('.invitation-button').height($('.invitation-button').width());

        socket.on('room:game-started', handleGameStartedEvent);

        return () => {
            // Events unmounten
            socket.off('room:game-started', handleGameStartedEvent);
            document.getElementById("game-content-wrapper").style.backgroundImage = "url(../../img/background_white.png)";
        };

    }, [socket, handleGameStartedEvent]);

    return (
        <div id='game-content'>
            <ColorSelector />
            <StartGame hostId={ props.hostId } />
            <InvitationCopyBoards roomId={ props.roomId } />
        </div>
    );
}

export default Lobby;