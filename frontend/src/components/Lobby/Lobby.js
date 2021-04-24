import { useContext, useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import $ from 'jquery';

import './Lobby.css'

import SideBar from '../SideBar/SideBar';
import Title from '../Home/Title/Title';
import StartGame from './StartGame/StartGame';
import InvitationCopyBoards from './InvitationCopyBoards/InvitationCopyBoards';
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

    useEffect(() => {
        // Schauen, ob man sich überhaupt in einem Raum befindet 
        socket.emit('room:is-in-room', (isInRoom) => {
            if(!isInRoom) {
                history.push('/');

            // Wenn sich der Socket in einem Raum befindet (wurde durch das joinen eines Raums auf die Seite gebracht
            } else {
                let gameData = location.state.data;

                setGameId(gameData.gameTypeId);
                setRoomId(gameData.roomId);
                setHostId(gameData.hostId);
                setPlayers(gameData.players);
            }
        });
        
    }, [socket, history, location.state]);


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

    // Kameras und Buttons immer in der gleichen Proportion anzeigen
    useEffect(() => {
        function handleResize() {
            $('.camera').height($('.camera').width()/16 * 9);
            $('.invitation-button').height($('.invitation-button').width());
        }

        // Am Anfang richtige breite setzten
        $('.camera').height($('.camera').width()/16 * 9);
        $('.invitation-button').height($('.invitation-button').width());

        window.addEventListener('resize', handleResize);
    });


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
                                    <StartGame hostId={ hostId } />
                                    <InvitationCopyBoards roomId={ roomId } />
                                </div>
                                <div className='top-left camera'>
                                    
                                </div>
                                <div className='top-right camera'>
                                    
                                </div>
                                <div className='bottom-left camera'>
                                    
                                </div>
                                <div className='bottom-right camera'>
                                    
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