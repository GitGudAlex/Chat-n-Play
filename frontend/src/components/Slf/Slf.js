import { useContext, useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import $ from 'jquery';

import Title from '../Home/Title/Title';
import PlayerCorner from '../PlayerCorner/PlayerCorner';
import SideBar from '../SideBar/SideBar';

import CategorySelection from './CategorySelection/CategorySelection';

import SocketContext from '../../services/socket';

import './Slf.css';

function Slf(props) {

    // Game Data
    const [gameId, setGameId] = useState();
    const [isHost, setIsHost] = useState();
    const [players, setPlayers] = useState();

    // 0: Kategorien auswählen | 1: Wörter finden | 2: Wörter bewerten | 3: Spiel vorbei
    const [gameStatus, setGameStatus] = useState();

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

        // Wenn sich der Socket in einem Raum befindet (wurde durch das joinen eines Raums auf die Seite gebracht)
        } else {

            // Spiel ID bekommen
            setGameId(location.state.gameId);
            setGameStatus(0);

            // Spieler bekommen am Anfang
            socket.emit('room:get-players', (data) => {
                setPlayers(data.players);

                // Schauen ob man der Host ist
                if(data.hostId === socket.id) {
                    setIsHost(true);
                } else {
                    setIsHost(false);
                }
            });

            // Wenn die Fenstergröße geändert wird -> Größe anpassen
            window.addEventListener('resize', () => {
                $('.player').height($('.player').width()/16 * 9);
            });

            // API Calls
            if(gameId !== undefined) {
                fetchGameData(gameId);
                fetchRulesData(gameId);
    
            }
        }

    }, [socket, history, location.state, gameId]);
    
    useEffect(() => {
        socket.emit('room:is-in-room', handleInRoomCallback);

    }, [socket, handleInRoomCallback]);


    // Event wenn ein Spieler joint oder jemand das Spiel verlässt
    const handleRoomUpdateEvent = useCallback((data) => {
        setPlayers(data.players);
    }, []);

    // Socket Events
    useEffect(() => { 
        socket.on('room:update', handleRoomUpdateEvent);
        
    }, [socket, handleRoomUpdateEvent]);


    // Richtiges Verhätniss setzten
    useEffect(() => {
        // Am Anfang richtiges Verhältniss setzten
        $('.player').height($('.player').width()/16 * 9);

    }, [players, rules]);


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
            // Events unmounten
            socket.off('room:update');

            // den socket.io raum verlassen
            socket.emit('room:leave-room');
        }
    }, [socket, history])


    // Schauen ob man selbst der neue Host ist
    const handleHostChanged = useCallback((data) => {
        if(data.hostId === socket.id) {
            setIsHost(true); 

        }

    }, [socket]);

    useEffect(() => {
        // Wenn der Host sich ändert
        socket.on('room:hostChanged', handleHostChanged);

        return() => {
            socket.off('room:hostChanged');
        }

    }, [socket, handleHostChanged]);


    if(rules === undefined || players === undefined || isHost === undefined) {
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
        // Richtigen Content je nach Spielsatus anzeigen
        let gameContent;

        if(gameStatus === 0) {
            gameContent = <CategorySelection isHost={ isHost } />

        }
        
        return (
            <div className='game-wrapper p-0'>
                <header className='game-header'>
                    <Title text={ gameName } height="10vh" fontSize="4vw"/>
                </header>
                <main className='game-body-wrapper'>
                    <div className='container-fluid p-0'>
                        <div className='row game-body m-0'>
                            <div className='sidebar-wrapper p-0'>
                                <SideBar position='left' contentId='#game-content-wrapper' sideBarWidth={ 40 } sideBarWindowWidth={ 350 } rules={ rules }/>
                            </div>
                            <div id='game-content-wrapper' className='col p-0'>
                                <div className='game-content'>
                                    { gameContent }
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
        )
    }
}

export default Slf;