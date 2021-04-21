import { useCallback, useContext, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import $ from "jquery";

import './Home.css'

import SocketContext from '../../services/socket';
import Title from './Title/Title';
import Description from './Description/Description';
import GameCategoriesList from './GameCategoriesList/GameCategoriesList';

function Home() {

    // Router Stuff
    const history = useHistory();
    const location = useLocation();

    // Socket.io
    const socket = useContext(SocketContext);

    //Events:
    // Wenn man einem Raum gejoined ist -> Lobby laden
    const handleRoomJoined = useCallback((data) => {
        // Modals schließen
        $('#create-game-modal-' + data.gameTypeId).modal('hide');
        $('#join-game-modal').modal('hide');

        history.push({
            pathname: '/lobby/' + data.roomId,
            state: { data: data }
        });

    }, [history]);

    useEffect(() => {
        // Wenn man einem Raum gejoint ist -> Lobby laden
        socket.on("room:joined", handleRoomJoined);

        // Iniviation Link -> Direkt Code Feld Ausfüllen
        let parameters = location.state;

        if(parameters !== undefined) {
            $('#join-game-modal').modal('show');
            $('#join-game-roomid-input').val(parameters.roomId);
        }
        
    }, [socket, location, handleRoomJoined]);

    return (
        <div className='p-0'>
            <header className="sticky-top">
                <Title text="Chat N' Play" height="150px" fontSize="5em"/>
            </header>
            <main>
                <div className='container-fluid'>
                    <div className='row justify-content-center'>
                        <div className="col">
                            <Description />
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className="col p-0">
                            <GameCategoriesList />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;