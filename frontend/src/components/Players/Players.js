import { useCallback, useContext, useLayoutEffect } from 'react';
import { useHistory } from 'react-router';
import $ from 'jquery';
import Peer from 'peerjs';

import './Players.css'; 

import Player from './Player/Player';
import SocketContext from "../../services/socket";

function Players(props) {

    const socket = useContext(SocketContext);
    const useVideos = false;

    // Router Stuff
    const history = useHistory();

    // Positionen der Spieler
    const positions = ['top-left', 'bottom-right', 'top-right', 'bottom-left'];

    const resizePlayerHandler = useCallback(() => {
        $('.player').height($('.player').width()/16 * 9);

    }, []);

    useLayoutEffect(() => {
        // Wenn die Fenstergröße geändert wird -> Größe anpassen
        window.addEventListener('resize', resizePlayerHandler);

        return () => {
            window.removeEventListener('resize', resizePlayerHandler);
        }

    }, [resizePlayerHandler]);

    /**
     * 1. Spieler joint einem Raum
     * 2. a) Spieler akzeptiert Kamera nicht -> aus dem Raum schmeißen
     * 2. b) Spieler akzeptiert Kamera -> Event an Server schicken, dass ein Spieler gejoined ist (webcam:joined)
     * 3. Alle anderen Spieler erhalten ein Event, dass ein Spieler gejoint ist + dessen id (webcam:user-joined)
     * 4. Nur bauen alle schon im Raum bestehenden Sockets eine Verbindung zum neuen Socket auf.
     */

    useLayoutEffect(() => {
        const constraints = {
            'video': true,
            'audio': true
        }

        if(useVideos) {
            const addVideoStream = (socketId, stream) => {
                let video = document.getElementById('player-video-' + socketId);
                video.srcObject = stream;
    
                video.onloadedmetadata = function(e) {
                    video.play();
                };
            }
    
            navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                // Eigener Peer
                const peer = new Peer({
                    undefined,
                    path: '/peerjs',
                    host: '/',
                    port: '8080'
                });
    
                // Kamera wird erlaubt
                let video = document.getElementById('player-video-' + socket.id);
                video.muted = true;
                video.srcObject = stream.clone();
    
                // Eigene Kamera abspielen
                video.onloadedmetadata = function(e) {
                    video.play();
                };
    
                peer.on('open', id => {
                    // Server sagen, dass man nun einen Stream hat zum senden
                    socket.emit('webcam:joined', { peerId: id });
                });
    
                // Wenn ein neuer User connected => mit neuem User verbinden
                socket.on('webcam:user-joined', data => {
                    connectToNewUser(data.peerId, data.socketId);
                });
    
                const connectToNewUser = (peerId, otherSocketId) => {
                    const call = peer.call(peerId, stream, { metadata: { socketId: socket.id }});
    
                    call.on('stream', userVideoStream => {
                        addVideoStream(otherSocketId, userVideoStream);
                    });
                }
    
                peer.on('call', call => {
                    let otherSocketId = call.metadata.socketId;
                    call.answer(stream, { metadata: { socketId: socket.id }});
    
                    call.on('stream', userVideoStream => {
                        addVideoStream(otherSocketId, userVideoStream);
                    });
                });
    
    
            // Kamera wird nicht erlaubt
            }).catch(function(err) {

                // Aus dem Spiel schmeißen
                socket.emit('room:leave-room');
                history.push('/');
            });
        }

    }, [socket, useVideos, history]);

    return (
        <div className='players'>
            {
                props.players.map(player => {
                    let score = props.scores.find(score => score.username === player.username)
                    console.log(props.ludo);
                    return (
                        <Player key = { player.username  } 
                            username = { player.username }
                            socketId = { player.socketId }
                            color = { player.color }
                            position = { positions[player.position] }
                            score = { score === undefined ? undefined : score.score } 
                            rank = { score === undefined ? undefined : score.rank }
                            ludo = { props.ludo === undefined ? undefined : props.ludo }
                            width = { props.width }
                            ready = { props.readyPlayers.find(entry => entry === player.socketId) === undefined ? false : true }
                        />
                    )
                })
            }
        </div>
    );
}

export default Players;