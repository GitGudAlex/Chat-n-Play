import { useCallback, useContext, useEffect } from 'react';
import $ from 'jquery';

import './Description.css'
import '../../../fonts/coffee+teademo-Regular.ttf'
import Grafik from '../../../img/GrafikStartseite.png'

import SocketContext from '../../../services/socket';

function Description() {

     // Socket holen
     const socket = useContext(SocketContext);

    // Einen Raum beitreten
    const joinRoom = useCallback(() => {
        let username = $('#join-game-username-input').val();
        let roomId = $('#join-game-roomid-input').val();

        // Raum joinen
        socket.emit('room:join', { roomId: roomId, username }, (error) => {
            if(error) {
                $('#join-game-error-output').text(error);

            }
        });

    }, [socket]);

    useEffect(() => {
        // Autofocus für Nameneingabe
        $(document).on('shown.bs.modal', '#join-game-modal', function () {
            $('#join-game-username-input').focus();
        });

        //Enter input für Submit Button ermöglichen
        $(".modal").keyup(function(event) {
            if (event.keyCode === 13) {
                console.log("button pressed via Enter");
                document.getElementById("room:join").click();
            }
        });
    });

    return (
        <div id="home-description">
            <div id='home-description-wrapper'>
                <h2 className='text-center'>Willkommen zu Chat&nbsp;N'&nbsp;Play</h2>
                    <div>
                        <img src={Grafik} id="img-Startseite" alt='Zwei Menschen nutzen mobile Geräte um miteinader zu kommunizieren'></img>
                    </div>
                <p id='home-description-text' className='text-center'>Hier kannst du mit deinen Freunden auch über Distanz das Spieleabend-Feeling erleben.<br />
                Erstelle einfach einen Raum und lade deine Freunde über einen Link ein<br />
                oder lasse Ihnen den Zugangscode zukommen.</p>
            </div>
            <div id='home-description-join-game-btn' className='d-flex justify-content-center'>
                <button type="button" className="btn btn-dark btn-lg" data-toggle="modal" data-target="#join-game-modal">Spiel beitreten</button>
            </div>

            {/* Modal */}
            <div className="modal fade" id="join-game-modal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content" id="modal-join-game">
                        <div className="modal-header">
                            <h5 className="modal-title">Trete einem Spiel bei</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <div className="form-group">
                                    <input id='join-game-username-input' type="text" className="form-control" placeholder="Username" />
                                </div>
                                <div className="form-group">
                                    <input id='join-game-roomid-input' type="text" className="form-control" placeholder="Code" />
                                    <small htmlFor="exampleInputPassword1">Gebe hier den Code ein, den du von deinem Freund bekommen hast.</small>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="acceptBtn1" />
                                    <label className="form-check-label" htmlFor="acceptBtn1">
                                        Hier mit stimme ich zu, dass während des Spiels Aufnahmen gemacht werden dürfen.
                                    </label>
                                </div>
                                <div>
                                    <small id='join-game-error-output' className="text-danger"></small>
                                </div>
                                <div className='text-center'>
                                    <button id="room:join" type="submit" className="btn btn-dark" onClick={ joinRoom }>Raum beitreten</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Description;