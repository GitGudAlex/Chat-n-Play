import { useContext, useState, useEffect, useCallback, useRef, useLayoutEffect  } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import $ from 'jquery';

import SocketContext from "../../services/socket";

import './GameBase.css';

import Title from '../Home/Title/Title';
import SideBar from '../SideBar/SideBar';
import Lobby from '../Lobby/Lobby';
import PageNotFound from '../PageNotFound/PageNotFound';
import Ludo from '../Ludo/Ludo';
import Slf from '../Slf/Slf';
import Players from '../Players/Players';
import Home from '../Home/Home';

function GameBase(props) {

    // Design Stuff
    const isResponsive = useRef();

    // Router Stuff
    const history = useHistory();
    const location = useLocation();

    // Game Data (roomid, gameid, players, ...)
    const [gameId, setGameId] = useState();
    const [roomId, setRoomId] = useState();
    const [hostId, setHostId] = useState();
    const [players, setPlayers] = useState();

    // Bei SLF die Spieler die 'weiter' geklickt haben
    const [playersReady, setPlayersReady] = useState([]);

    // Um bei Ludo die Häuser anzuzeigen
    const [ludo, setLudo] = useState();

    const [scores, setScores] = useState([]);

    // vom api call
    const [gameName, setGameName] = useState('');
    const [rules, setRules] = useState();

    // Socket.io
    const socket = useContext(SocketContext);

    // Schauen, ob man sich überhaupt in einem Raum befindet
    const handleInRoomCallback = useCallback((isInRoom) => {

        // Spieler befindet sich nicht im Raum
        if(!isInRoom) {
            history.push('/');

        // Spieler befindet sich im Raum
        } else {
            let gameData = location.state.data;

            setRoomId(gameData.roomId);
            setHostId(gameData.hostId);
            setPlayers(gameData.players);
            setGameId(gameData.gameTypeId);

        }

    }, [history, location.state]);

    // Ob man sich überhaupt in einem Raum befindet, wenn man einem Spiel joint
    useEffect(() => {
        socket.emit('room:is-in-room', handleInRoomCallback);
    }, [socket, handleInRoomCallback]);

    // Wenn man eine andere Seite besucht, ob man noch in einem Raum ist
    useEffect(() => {
        setRules();

        setTimeout(() => {
            socket.emit('room:is-in-room', (isInRoom) => {
                if(!isInRoom) {
                    history.push('/');
                }
            });
        }, 200);
    }, [socket, location, history]);

    // Event wenn ein Spieler joint oder jemand das Spiel verlässt
    const handleRoomUpdateEvent = useCallback((data) => {
        setPlayers(data.players);
    }, []);

    // Schauen ob man selbst der neue Host ist
    const handleHostChanged = useCallback((data) => {
        setHostId(data.hostId);
    }, []);

    // Event wenn sich die Scores Updaten
    const handleScoreUpdateEvent = useCallback((data) => {
        setScores(data.scores);
        console.log("lllllll: ", data);
    }, []);

    // Wenn neue Spieler in den Raum kommen oder aus dem Raum austreten
    useEffect(() => { 
        socket.on('room:update', handleRoomUpdateEvent);
        socket.on('room:hostChanged', handleHostChanged);
        socket.on('slf:score-update', handleScoreUpdateEvent);

        return () => {
            // Events unmounten
            socket.off('room:update');
            socket.off('room:hostChanged');
            socket.off('slf:score-update');
        };

    }, [socket, handleRoomUpdateEvent, handleHostChanged, handleScoreUpdateEvent]);


    // Um die Häckchen bei den Kameras anzuzeigen
    useEffect(() => {
        socket.on('slf:players-ready-count', (data) => {
            if(data.playersReady.length === players.length) {
                setPlayersReady([]);

            } else {
                setPlayersReady(data.playersReady);

            }
        });

        return() => {
            socket.off('slf:players-ready-count');
        }
    }, [socket, players]);

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
        socket.on('room:game-started', (data) => {
            if(data.route.split('/')[1] === 'ludo') {
                setLudo('Ludo');
            }
        });
    }, [socket]);


    useEffect(() => { 
        return () => {
            // Wenn man in der Browser historie zurück geht, soll man aus dem Spiel fliegen
            socket.emit('room:leave-room');
        }
    }, [socket])


    // Wenn die Sidebar aufgeklappt wird und die Anordnung geändert werden muss, wegen zu wenig Platz
    // Am Anfang richtige werte setzetn für bessere performance
    useLayoutEffect(() => {
        if($('#game-content').width() < 800) {
            isResponsive.current = false;

        } else {
            isResponsive.current = true;
        }

        const heightObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                if(entry.contentRect.width < 800 && isResponsive.current === false) {
                    $('#game-content').css({ justifyContent: 'center' });
                    $('.start-game').css({ width: '80% !important;' });

                    isResponsive.current = true;

                } else {
                    if(entry.contentRect.width >= 800 && isResponsive.current === true) {
                        $('#game-content').css({ justifyContent: 'space-around' });
                        $('.start-game').css({ width: '55% !important;' });

                        isResponsive.current = false;
                    }
                }
                });
        });

        const lobbyDivWrapper = document.getElementById('game-content');

        if (lobbyDivWrapper instanceof Element) {
            heightObserver.observe(lobbyDivWrapper);
        }

        return () => {
            heightObserver.disconnect();
        };
    });

    if(players === undefined || roomId === undefined || gameId === undefined || hostId === undefined || rules === undefined || gameName === undefined) {
        return (
            <div style={{ height: '100%' }}>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                    <div className="spinner-border" style={{ width: '4rem', height: '4rem' }} role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id='game-wrapper p-0'>
            <header id='game-header'>
                <Title text={ gameName } height="10vh" fontSize="4vw"/>
            </header>
            <main id='game-body-wrapper'>
                <div className='container-fluid p-0'>
                    <div id='game-body' className='row m-0'>
                        <div id='sidebar-wrapper' className='p-0'>
                            <SideBar position='left' contentId='#game-content-wrapper' sideBarWidth={ 40 } sideBarWindowWidth={ 350 } rules={ rules }/>
                        </div>
                        <div id='game-content-wrapper' className='col p-0'>
                            <Router>
                                <Switch>
                                    <Route path='/' exact component={ Home } />
                                    <Route path={`${ props.match.path }/lobby/:roomid`} render={ () => <Lobby hostId={ hostId } roomId={ roomId } gameId={ gameId }/> } />
                                    <Route path={`${props.match.path }/ludo/:roomid`} render={ () => <Ludo /> }/>
                                    <Route path={`${ props.match.path }/slf/:roomid`} render={ () => <Slf isHost={ hostId === socket.id ? true : false } players={ players }/> } />
                                    <Route component={ PageNotFound } />
                                </Switch>
                            </Router>
                            <Players players={ players } scores={ scores } ludo={ ludo } readyPlayers={ playersReady }/>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default GameBase;
