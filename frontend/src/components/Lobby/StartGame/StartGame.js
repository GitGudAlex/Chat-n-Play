import { useContext, useEffect, useState, useCallback } from 'react';
import $ from 'jquery';

import './StartGame.css'

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
            <p className='start-game-text'>Wenn alle Teilnehmer anwesend sind, kannst du das Spiel starten</p>
            <input className='start-game-btn btn-lg btn-primary' type='button' value='Spiel starten' onClick={ startGame } />
            <small id='start-game-error' className='text-danger'></small>
        </div>
      );
  } else {
    return (
        <div className='start-game'>
            <p className='start-game-text'>Der Host wird das Spiel in kürze starten</p>
        </div>
      );
  }
}

export default Chat;
