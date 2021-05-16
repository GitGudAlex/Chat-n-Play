import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import $ from 'jquery';

import './Lobby.css'

import SideBar from '../SideBar/SideBar';
import Title from '../Home/Title/Title';
import StartGame from './StartGame/StartGame';
import InvitationCopyBoards from './InvitationCopyBoards/InvitationCopyBoards';
import ColorSelector from './ColorSelector/ColorSelector';
import Players from '../Players/Players';

import SocketContext from '../../services/socket';

function Lobby() {

    // Game Data (roomid, gameid, players, ...)
    const [gameId, setGameId] = useState();
    const [roomId, setRoomId] = useState();
    const [hostId, setHostId] = useState();
    const [players, setPlayers] = useState();

    // Design Stuff
    const isResponsive = useRef();

    // vom api call
    const [gameName, setGameName] = useState();
    const [rules, setRules] = useState();

    // Router Stuff
    const history = useHistory();
    const location = useLocation();

    // Socket.io
    const socket = useContext(SocketContext);

    // Variable um zu speichern ob das Spiel gerade angefangen wurde. Wird benötige,
    // damit man nicht aus dem Spiel fliegt wenn der Component unmountet
    const started = useRef(false);

    // Schauen, ob man sich überhaupt in einem Raum befindet
    const handleInRoomCallback = useCallback((isInRoom) => {
        if(!isInRoom) {
            history.push('/');

        // Wenn sich der Socket in einem Raum befindet (wurde durch das joinen eines Raums auf die Seite gebracht)
        } else {
            let gameData = location.state.data;

            setRoomId(gameData.roomId);
            setHostId(gameData.hostId);
            setPlayers(gameData.players);
            setGameId(gameData.gameTypeId);

            // Am Anfang richtige Höhe setzten
            $('.invitation-button').height($('.invitation-button').width());
        }

        // Wenn die Sidebar aufgeklappt wird und die Anordnung geändert werden muss, wegen zu wenig Platz
        // Am Afang richtige werte setzetn für bessere performance
        if($('#lobby-content').width() < 800) {
            isResponsive.current = false;

        } else {
            isResponsive.current = true;

        }

        const heightObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                if(entry.contentRect.width < 800 && isResponsive.current === false) {
                    $('.start-game-wrapper').css({ justifyContent: 'center' });
                    $('.start-game').css({ width: '80% !important;' });

                    isResponsive.current = true;

                } else {
                    if(entry.contentRect.width >= 800 && isResponsive.current === true) {
                        $('.start-game-wrapper').css({ justifyContent: 'space-around' });
                        $('.start-game').css({ width: '55% !important;' });

                        isResponsive.current = false;
                    }
                }
                });
        });

        const lobbyDivWrapper = document.querySelector('#lobby-content');

        if (lobbyDivWrapper instanceof Element) {
            heightObserver.observe(lobbyDivWrapper);
        }

        return () => {
            heightObserver.disconnect();
        };

    }, [history, location.state]);

    useEffect(() => {
        socket.emit('room:is-in-room', handleInRoomCallback);

    }, [socket, handleInRoomCallback]);

    // Event wenn ein Spieler joint oder jemand das Spiel verlässt
    const handleRoomUpdateEvent = useCallback((data) => {
        setPlayers(data.players);
        
        $('.invitation-button').height($('.invitation-button').width());
    }, []);


    // Wenn das Spiel gestarted wurde
    const handleGameStartedEvent = useCallback((data) => {
        started.current = true;

        history.push({
            pathname: data.route,
            state: {
                gameId: gameId
            }
        });

    }, [history, gameId]);

    // Socket Events
    useEffect(() => { 
        socket.on('room:update', handleRoomUpdateEvent);
        socket.on('room:game-started', handleGameStartedEvent);

        return () => {
            // Events unmounten
            socket.off('room:update');
            socket.off('room:game-started');
        };

    }, [socket, handleRoomUpdateEvent, handleGameStartedEvent]);

    // API Calls
    useEffect(() => {   
        if(gameId !== undefined) {
            fetchGameData(gameId);
            fetchRulesData(gameId);

        }
    }, [gameId]);


    // API Call: Den Namen vom Spiel bekommen
    const fetchGameData = async(gameId) => {
        const data = await fetch("/games/name?id=" + gameId);
        const nameData = await data.json();

        setGameName(nameData.name);
    };

    // API Call: Die Regeln von dem Spiel bekommen
    const fetchRulesData = async(gameId) => {
        const data = await fetch("/games/rules?id=" + gameId);
        const rulesData = await data.json();

        setRules(rulesData.rules);
    };


    useEffect(() => { 
        return () => {
            // Wenn man in der Browser historie zurück geht, soll man aus dem Spiel fliegen
            if(!started.current) {
                socket.emit('room:leave-room');
            }
        }
    }, [socket])


    // Nur anzeigen, wenn man wirklich in einem Raum ist
    if(gameId === undefined) {
        return (
            <div style={{ height: '100%' }}>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                    <div className="spinner-border" style={{ width: '4rem', height: '4rem' }} role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
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
                                <Players players={ players } />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default Lobby;