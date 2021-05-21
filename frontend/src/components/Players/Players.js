import './Players.css'; 
import $ from 'jquery';

import Player from './Player/Player';
import { useContext, useCallback, useLayoutEffect, useRef, useEffect } from 'react';
import SocketContext from "../../services/socket";
import { useUserMedia } from './useUserMedia';

function Players(props) {

    const socket = useContext(SocketContext);

    const CAPTURE_OPTIONS = {
        audio: false,
        video: true,
    };

    // Positionen der Spieler
    const positions = ['top-left', 'bottom-right', 'top-right', 'bottom-left'];
    const videoRef = useRef();

    useLayoutEffect(() => {
         // Wenn die Fenstergröße geändert wird -> Größe anpassen
         window.addEventListener('resize', () => {
            $('.player').height($('.player').width()/16 * 9);
        });
    }, []);
    /*
    useEffect(()=>{
        // set up local video stream
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
            .then(stream => {
                videoRef.current.srcObject = stream;
            })
        } else {
            alert('Your browser does not support getUserMedia API');
        }
    })
    */

    return (
        <div className='players'>
            {
                props.players.map(player => {
                    let score = props.scores.find(score => score.username === player.username)

                    return (
                        <Player key = { player.username  } 
                            username = { player.username }
                            color = { player.color }
                            position = { positions[player.position] }
                            score = { score === undefined ? undefined : score.score } 
                            ludo = { props.ludo === undefined ? undefined : props.ludo }
                            width = { props.width }
                            height = { props.width / 16*9 }
                            ready = { props.readyPlayers.find(entry => entry === player.socketId) === undefined ? false : true }
                            video = { videoRef }/>
                    )
                })
            }
        </div>
    );
}

export default Players;