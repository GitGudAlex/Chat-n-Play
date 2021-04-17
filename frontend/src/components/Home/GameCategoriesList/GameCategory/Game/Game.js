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

    }, [props.gameId]);


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
                <h4>{ props.name }</h4>
            </div>
            <div>
                <p>{ props.description }</p>
            </div>
            <div>
                <button type="button" className="btn btn-primary btn-lg" data-toggle="modal" data-target={ "#create-game-modal-" + gameId }>Raum erstellen</button>
            </div>


            {/* Modal */}
            <div className="modal fade" id={ "create-game-modal-" + gameId } role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
                                    <input id={ 'create-game-username-input-' + gameId } type="text" className="form-control" placeholder="Username" />
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
                                    <button type="submit" className="btn btn-primary" onClick={ createRoom }>Raum erstellen</button>
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