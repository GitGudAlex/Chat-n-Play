import { useContext, useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import $ from 'jquery';

import './Lobby.css'

import SideBar from '../SideBar/SideBar';
import Title from '../Home/Title/Title';
import StartGame from './StartGame/StartGame';
import PlayerCorner from '../PlayerCorner/PlayerCorner';
import InvitationCopyBoards from './InvitationCopyBoards/InvitationCopyBoards';
import ColorSelector from './ColorSelector/ColorSelector';
import SocketContext from '../../services/socket';

function Lobby() {

    // Game Data (roomid, gameid, players, ...)
    const [gameId, setGameId] = useState();
    const [roomId, setRoomId] = useState();
    const [hostId, setHostId] = useState();
    const [players, setPlayers] = useState();

    // vom api call
    const [gameName, setGameName] = useState();
    const [rules, setRules] = useState();

    // Router Stuff
    const history = useHistory();
    const location = useLocation();

    // Socket.io
    const socket = useContext(SocketContext);

    // Positionen der Spieler
    const positions = ['top-left', 'bottom-right', 'top-right', 'bottom-left'];

    // Schauen, ob man sich überhaupt in einem Raum befindet
    const handleInRoomCallback = useCallback((isInRoom) => {
        if(!isInRoom) {
            history.push('/');

        // Wenn sich der Socket in einem Raum befindet (wurde durch das joinen eines Raums auf die Seite gebracht
        } else {
            let gameData = location.state.data;

            setRoomId(gameData.roomId);
            setHostId(gameData.hostId);
            setPlayers(gameData.players);
            setGameId(gameData.gameTypeId);

            // Wenn die Fenstergröße geändert wird
            // Am Anfang richtige breite setzten
            $('.player').height($('.player').width()/16 * 9);
            $('.invitation-button').height($('.invitation-button').width());
            
            window.addEventListener('resize', () => {
                $('.player').height($('.player').width()/16 * 9);
                $('.invitation-button').height($('.invitation-button').width());
            });
        }

    }, [history, location.state]);


    // Socket Events
    useEffect(() => { 
        socket.emit('room:is-in-room', handleInRoomCallback);
        socket.on('room:update', (data) => {
            setPlayers(data.players);

            $('.player').height($('.player').width()/16 * 9);
            $('.invitation-button').height($('.invitation-button').width());
        });
        
    }, [socket, handleInRoomCallback]);


    // Spieldaten bekommen
    useEffect(() => {   
        if(gameId !== undefined) {
            fetchGameData(gameId);
            fetchRulesData(gameId);

        }
    }, [gameId]);


    // Wenn man in der Browser historie zurück geht, soll man aus dem Spiel fliegen
    useEffect(() => {    
        return () => {
            socket.emit('room:leave-room');
        }
    }, [socket])

    // Den Namen vom Spiel bekommen
    const fetchGameData = async(gameId) => {
        const data = await fetch("/games/name?id=" + gameId);
        const nameData = await data.json();

        setGameName(nameData.name);
    };

    // Die Regeln von dem Spiel bekommen
    const fetchRulesData = async(gameId) => {
        const data = await fetch("/games/rules?id=" + gameId);
        const rulesData = await data.json();

        setRules(rulesData.rules);
    };


    // Events unmounten
    useEffect(() => {    
        return () => {
            socket.off('room:update');
        }
    }, [socket])


    // Nur anzeigen, wenn man wirklich in einem Raum ist
    if(gameId === undefined) {
        return (
            <div>
                
            </div>
        );

    } else {

        return (
            <div className='lobby-wrapper p-0'>
                <header className="lobby-header">
                    <Title text={ gameName } height="10vh" fontSize="4vw"/>
                </header>
                <main className='lobby-body'>
                    <div className="container-fluid p-0">
                        <div className='row lobby-body-wrapper m-0'>
                            <div className='sidebar-wrapper p-0'>
                                <SideBar position='left' contentId='#lobby-content' sideBarWidth={ 40 } sideBarWindowWidth={ 350 } rules={ rules }/>
                            </div>
                            <div id='lobby-content' className='col p-0'>
                                <div className='start-game-wrapper'>
                                    <ColorSelector />
                                    <StartGame hostId={ hostId } />
                                    <InvitationCopyBoards roomId={ roomId } />
                                </div>
                                <div className='players'>
                                    {
                                        players.map(player => (
                                            <PlayerCorner key = { player.username  } 
                                                username = { player.username }
                                                color = { player.color }
                                                position = { positions[player.position] } />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default Lobby;