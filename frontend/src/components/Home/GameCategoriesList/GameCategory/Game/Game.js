import { useState, useCallback, useEffect, useContext } from 'react';
import $ from 'jquery';

import './Game.css';

import SocketContext from '../../../../../services/socket';

function Game(props) {
    // Socket holen
    const socket = useContext(SocketContext);

    // Spiel abspeichern
    const [gameId, setgameId] = useState();

    useEffect(() => {
        setgameId(props.gameId)

        // Autofocus für Nameneingabe
        $(document).on('shown.bs.modal', '#create-game-modal-' + props.gameId, function () {
            $('#create-game-username-input-' + props.gameId).focus();
        });

    }, [props.gameId]);

    // Icon change
    $('#buttonCollapse').click(function(){
        $(this).find('svg').toggleClass('bi bi-caret-right-fill').toggleClass('bi bi-caret-down-fill');
        });

    // Einen Raum erstellen
    const createRoom = useCallback(() => {
        socket.emit('room:create', { gameTypeId: gameId }, (error) => {
            if(error) {
                $('#create-game-error-output-' + gameId).text(error);

            }
        });
    }, [socket, gameId]);

    return (
        <div className='m-5'>
            <div>
                <img src={props.img} alt='background'/>
            </div>
            <div className="d-flex align-items-center justify-content-center">
                <button id="buttonCollapse" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </button>
                <h4 id="nameGame">{ props.name }</h4>
                <button type="button" className="btn btn-dark btn-lg" data-toggle="modal" data-target={ "#create-game-modal-" + gameId }>Raum erstellen</button>
            </div>
            <div class="collapse" id="collapseExample">
                    { props.description }           
            </div>


            {/* Modal */}
            <div className="modal fade" id={ "create-game-modal-" + gameId } role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Erstelle ein "{ props.name }" Spiel</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <div className="form-group">
                                    <input id={ 'create-game-username-input-' + gameId } type="text" className="form-control" placeholder="Username"/>
                                </div>
                                <div className="form-check m-4">
                                    <input className="form-check-input" type="checkbox" value="" id={ "acceptBtn-" + gameId } />
                                    <label className="form-check-label" htmlFor={ "acceptBtn-" + gameId }>
                                        Hier mit stimme ich zu, dass während des Spiels Aufnahmen gemacht werden dürfen.
                                    </label>
                                </div>
                                <div>
                                    <small id={ 'create-game-error-output-' + gameId } className="text-danger"></small>
                                </div>
                                <div className='text-center'>
                                    <button type="submit" className="btn btn-dark" onClick={ createRoom }>Raum erstellen</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Game;