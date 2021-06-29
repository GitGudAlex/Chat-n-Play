import { useContext, useEffect, useState, useCallback } from 'react';
import $ from 'jquery';

import './StartGame.css'

import Sprechblase_Host_warten from '../../../img/Sprechblase_Host_warten.png';
import Sprechblase_Info from '../../../img/Sprechblase_Info.png';
import Sprechblase_Gast_Hostinfo from '../../../img/Sprechblase_Gast_Hostinfo.png';
import SprechblaseHost from '../../../img/SprechblaseHost.png'
import SprechblaseGast from '../../../img/SprechblaseGast.png'

import SocketContext from '../../../services/socket';

function Chat(props) {

  const [isHost, setIsHost] = useState(false);

  // Socket.io
  const socket = useContext(SocketContext);

  // Events:
  // Schauen ob man selbst der neue Host ist
  const handleHostChanged = useCallback((data) => {
    if(data.hostId === socket.id) {
        setIsHost(true); 

    }

  }, [socket]);

  useEffect(() => {
    // Wenn der Host sich ändert
    socket.on("room:hostChanged", handleHostChanged);

  }, [socket, handleHostChanged]);


  // Schauen ob man am Anfang der Host ist
  useEffect(() => {
    // Wenn der Host sich ändert
    if(props.hostId === socket.id) {
        setIsHost(true); 
    }

  }, [socket, props]);


  // Events unmounten
  useEffect(() => {    
    return () => {
        socket.off('room:hostChanged', handleHostChanged);
    }
  }, [socket, handleHostChanged])

  const startGame = () => {
    socket.emit('room:start-game', (error) => {
      $('#start-game-error').text(error);

      setTimeout(() => {
        $('#start-game-error').text('');

      }, 3000)
    });
  }


  if(isHost) {
    return (
        <div className='start-game'>
            <img src={SprechblaseHost} alt="Wenn alle Teilnehmer anwesend sind, kannst du das Spiel starten. In der Sidebar links, findest du Regeln, Chat und weitere Funktionen."  className="speechbubble"></img>
            <div className="d-flex justify-content-center">
            <input className='start-game-btn btn-lg btn-dark' type='button' value='Spiel starten' onClick={ startGame } />
            </div>
            <div className="d-flex justify-content-center">
            <small id='start-game-error' className='text-danger'></small>
            </div>
        </div>
      );
  } else {
    return (
        <div className='start-game'>
            <img src={SprechblaseGast} alt="Der Host wird das Spiel in Kürze starten. In der Sidebar links, findest du Regeln, Chat und weitere Funktionen." className="speechbubble"></img>
        </div>
      );
  }
}

export default Chat;
