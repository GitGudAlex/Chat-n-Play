import { useCallback, useContext, useLayoutEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import $ from 'jquery';
import Peer from 'peerjs';

import './Players.css'; 

import Player from './Player/Player';
import SocketContext from "../../services/socket";

function Players(props) {

    const socket = useContext(SocketContext);
    //const useVideos = process.env.NODE_ENV === 'production';
    const useVideos = true;
    //process.env.NODE_ENV === 'production';

    // Router Stuff
    const history = useHistory();

    const denialCounterRef = useRef(0);

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

    const clickEvent = () =>{
        document.getElementById("startWebcam").click();
    }

    const ask4Video = useCallback(() => {
        var constraints = {
            'audio': true, 
            'video': {
                'quality': 5,
            }
        };

        const addVideoStream = (socketId, stream) => {
            let video = document.getElementById('player-video-' + socketId);
            video.srcObject = stream.clone();

            video.onloadedmetadata = function(e) {
                video.play();
            };
        }

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

        navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            $("#enableWebcam").addClass("d-none");
            $("#disableWebcam").removeClass("d-none");

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
                let otherSocketId = call.metadata.socketId;
                call.answer(stream, { metadata: { socketId: socket.id }});

                call.on('stream', userVideoStream => {
                    addVideoStream(otherSocketId, userVideoStream);
                });
            });
        
            // Kamera deaktivieren
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
        })
        .catch(err => {
            //alert("Um ein Spiel spielen zu können, brauchen wir mindestens Zugriff auf dein Mikrofon.");

            // Nur nach Mikrofon fragen
            constraints = {
                'video': false,
                'audio': true
            }

            navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {

                props.settingAllowCamera(false);

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

                socket.on("webcam:micMuted", () =>{
                    stream.getAudioTracks()[0].enabled = false;
                });

                socket.on("webcam:micUnmuted", () =>{
                    stream.getAudioTracks()[0].enabled = true;
                });
            })
            .catch(err => {
                window.location.reload();

            });
        });

    }, [socket, history]);

    useLayoutEffect(() => {
        if(useVideos) {
            const captureVideoButton = document.querySelector('#startWebcam');
            captureVideoButton.onclick = () => {
                ask4Video();
            };

            clickEvent();
        }

        return () => {
            denialCounterRef.current = 0;
        }

    }, [socket, useVideos, ask4Video]);

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