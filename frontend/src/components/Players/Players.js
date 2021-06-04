import { useCallback, useContext, useLayoutEffect } from 'react';
import { useHistory } from 'react-router';
import $ from 'jquery';
import Peer from 'peerjs';

import './Players.css'; 

import Player from './Player/Player';
import SocketContext from "../../services/socket";

function Players(props) {

    const socket = useContext(SocketContext);
    const useVideos = process.env.NODE_ENV === 'production';

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
                let peerOptions;

                // Production
                if(process.env.NODE_ENV === 'production') {
                    peerOptions = {
                        undefined,
                        path: '/',
                        secure: true
                    }
                    
                // Development
                } else {
                    peerOptions = {
                        undefined,
                        path: '/peerjs',
                        host: '/',
                        port: '8080'
                    }
                }

                // Eigener Peer
                const peer = new Peer(peerOptions);
    
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
                
                socket.on("webcam:disconnected", () =>{
                    peer.disconnect();
                });
                

                peer.on("disconnected", ()=>{
                    console.log("disc");
                    stream.getTracks()[0].stop();
                });
    
    
            // Kamera wird nicht erlaubt
            }).catch(function(err) {
                alert("Bitte aktiviere deine Webcam um zu spielen");
                // Aus dem Spiel schmeißen
                socket.emit('room:leave-room');
                history.push("/");
            });
        }

    }, [socket, useVideos, history]);

    return (
        <div className='players'>
            {
                props.players.map(player => {
                    let score = props.scores.find(score => score.username === player.username)
                    
                    return (
                        <Player key = { player.username  } 

                            // Username des Spielers
                            username = { player.username }

                            // Socket Id des Spielers
                            socketId = { player.socketId }

                            // Farbe des Spielers
                            color = { player.color }

                            // Position des Spielers (oben links: 0, unten rechts: 1, oben rechts: 2, unten links: 3)
                            position = { positions[player.position] }

                            // die Punktzahl des Spielers
                            score = { score === undefined ? undefined : score.score } 

                            // Wenn es in dem Spiel eine Punktzahl gibt, zeigt der Rank die aktuelle Plazierung
                            rank = { score === undefined ? undefined : score.rank }

                            // Welches Spiel zurzeit gespielt wird
                            game = { props.game === undefined ? undefined : props.game }

                            // Breite der Kameras, kann optional gesetzt werden, wenn mehr platz für ein Spiel gebraucht wird
                            width = { props.width }

                            // Zeigt an ob ein Spieler 'bereit' ist. Zum Beispiel einen Button gedrückt hat 
                            ready = { props.readyPlayers.find(entry => entry === player.socketId) === undefined ? false : true }
                            
                            // Ob die Kamera / der Spieler man selbst ist
                            self = { player.socketId === socket.id }
                        />
                    )
                })
            }
        </div>
    );
}

export default Players;