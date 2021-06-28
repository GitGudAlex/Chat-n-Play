import { useCallback, useContext, useLayoutEffect } from 'react';
import { useHistory } from 'react-router';
import $ from 'jquery';
import Peer from 'peerjs';

import './Players.css'; 

import Player from './Player/Player';
import SocketContext from "../../services/socket";

function Players(props) {

    const socket = useContext(SocketContext);
    const useVideos = true;
    //const useVideos = true;
    //process.env.NODE_ENV === 'production';

    // Router Stuff
    const history = useHistory();

    // Positionen der Spieler
    const positions = ['top-left', 'bottom-right', 'top-right', 'bottom-left'];

    const resizePlayerHandler = useCallback(() => {
        $('.player').height($('.player').width()/16 * 9);

    }, []);

    const clickEvent = () =>{
        document.getElementById("startWebcam").click();
    }

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
        setTimeout(clickEvent, 3000);
        
        socket.on("room:joined", ()=>{
            setTimeout(clickEvent, 5000);
        });

        let constraints = {
            'video': true,
            'audio': true
        }

        if(useVideos) {
            const addVideoStream = (socketId, stream) => {
                let video = document.getElementById('player-video-' + socketId);
                video.srcObject = stream.clone();
    
                video.onloadedmetadata = function(e) {
                    video.play();
                };
            }

            const captureVideoButton = document.querySelector('#startWebcam');
            captureVideoButton.onclick = () =>{
                navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                $("#enableWebcam").addClass("d-none");
                $("#disableWebcam").removeClass("d-none");

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
                video.srcObject = stream;
    
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
                    console.log("disconnected status: ",peer.disconnected);
                    let otherSocketId = call.metadata.socketId;
                    call.answer(stream, { metadata: { socketId: socket.id }});

                    call.on('stream', userVideoStream => {
                        addVideoStream(otherSocketId, userVideoStream);
                    });
                    console.log("allConns: ", peer.connections);
                });
            
                //Kamera deaktivieren
                socket.on("webcam:disabled",() =>{
                     stream.getVideoTracks()[0].enabled = false;
                });

                socket.on("webcam:enabled",() =>{
                    stream.getVideoTracks()[0].enabled = true;
               });

                socket.on("webcam:micMuted", () =>{
                   stream.getAudioTracks()[0].enabled = false;
                });

                socket.on("webcam:micUnmuted", () =>{
                    stream.getAudioTracks()[0].enabled = true;
                });

            // Kamera wird nicht erlaubt
            }).catch(function(err) {
                //Beim joinen der Lobby
                alert("Bitte aktiviere deine Kamera oder dein Mikrofon um spielen zu können.");

                //Nur nach Mikrofon fragen
                constraints = {
                    'video': false,
                    'audio': true
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

                });
                //Jede 10 Sekunden nach Mikrofon fragen, solange noch nichts freigegeben wurde
                setTimeout(clickEvent,10000);
            });
        }
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