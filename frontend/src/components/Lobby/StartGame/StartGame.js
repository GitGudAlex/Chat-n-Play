import { useContext, useEffect, useState, useCallback } from 'react';
import $ from 'jquery';

import './StartGame.css'

import Sprechblase_Host_warten from '../../../img/Sprechblase_Host_warten.png';
import Sprechblase_Info from '../../../img/Sprechblase_Info.png';
import Sprechblase_Gast_Hostinfo from '../../../img/Sprechblase_Gast_Hostinfo.png';

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
        <div className='start-game container'>
          <div class="row">
            <div class="col-6">
              <img src={Sprechblase_Host_warten} id="host-warten" alt="Wenn alle Teilnehmer anwesend sind, kannst du das Spiel starten"  className="speechbubble"></img>
            </div>
            <div class="col">
              <img src={Sprechblase_Info} alt="Wenn alle Teilnehmer anwesend sind, kannst du das Spiel starten"  className="speechbubble-info"></img>
            </div>
          </div>
          <div class="d-flex justify-content-center">
            <input className='start-game-btn btn-lg btn-dark text-center' type='button' value='Spiel starten' onClick={ startGame } />
            <small id='start-game-error' className='text-danger text-center'></small>
          </div>
        </div>
      );
  } else {
    return (
        <div className='start-game container'>
          <div class="row">
            <div class="col-6">
              <img src={Sprechblase_Gast_Hostinfo} id="host-warten" alt="Wenn alle Teilnehmer anwesend sind, kannst du das Spiel starten"  className="speechbubble"></img>
            </div>
            <div class="col">
              <img src={Sprechblase_Info} alt="Wenn alle Teilnehmer anwesend sind, kannst du das Spiel starten"  className="speechbubble-info"></img>
            </div>
          </div>
        </div>
      );
  }
}

export default Chat;
