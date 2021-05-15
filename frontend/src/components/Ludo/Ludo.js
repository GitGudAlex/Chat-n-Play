import React, { useEffect,  useContext, useState, useCallback } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import $ from "jquery";

import './Ludo.css'

import House from './house/house';
import Matchfield from './matchfield/matchfield';
import Title from '../Home/Title/Title';
import PlayerCorner from '../PlayerCorner/PlayerCorner';
import SideBar from '../SideBar/SideBar';

import SocketContext from '../../services/socket';

function Ludo() {

    // Game Data
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

        // Wenn sich der Socket in einem Raum befindet (wurde durch das joinen eines Raums auf die Seite gebracht)
        } else {

            // Spieler bekommen am Anfang
            socket.emit('room:get-players', (data) => {
                setPlayers(data.players);
            });

            // Wenn die Fenstergröße geändert wird -> Größe anpassen
            window.addEventListener('resize', () => {
                $('.player').height($('.player').width()/16 * 9);
            });


            // API Calls
            if(location.state.gameId !== undefined) {
                fetchGameData(location.state.gameId);
                fetchRulesData(location.state.gameId)
    
            }
        }

    }, [socket, history, location.state]);

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

    
    socket.once('ludo:first-player', player => {
        console.log('color' + player.color);
        $('.dice').css({'border-color':player.color});
        $('#firstPlayer').css({'display':'none'});
    });

    //Würfel für ersten Spieler entsperren
    socket.once("ludo:unlockDice-firstPlayer", () =>{
        $("#dice").prop("disabled",false);
    });

    //Alle Buttons sperren
    useEffect(()=>{
        $(".matchfield").find(":button").prop("disabled", true);
        $("#dice").prop("disabled", true);
    });

    const roll = () => {
        socket.emit("ludo:rollDice");
        $("#dice").prop("disabled", true);   
    }

    useEffect(() => {
        socket.on("ludo:dicedValue", dice => {
            console.log("Würfel: " + dice)
            $("#dice").html(dice);
        });
    
        socket.on("ludo:showMoves", show => {
            console.log("socket on ShowMoves: " + show);
            show.forEach(element => {
                $('#'+element).html('X');
            })
        });

        // Events unsubscriben
        return () => {
            socket.off('ludo:dicedValue');
            socket.off('ludo:showMoves');
        }
    });

    useEffect(()=>{
        socket.on("ludo:unlockMoveFields", figures=>{
            figures.forEach(element =>{
                $("#"+element).prop("disabled", false);
            });
        });
        // Event unsubscriben
        return () => {
            socket.off('ludo:unlockMoveFields');
        }
    });

    useEffect(() => {
        socket.on('ludo:leaveHouse', move => {
            console.log("Positionen aus dem Loch: " + move);
            $("#"+move[1]).css({'background-color':move[2]});
            $("#"+move[0]).css({'background-color':'white'});
        });

        // Event unsubscriben
        return () => {
            socket.off('ludo:leaveHouse');
        }
    });

    useEffect(() => {
        socket.on('ludo:throwFigure', move => {
            $("#"+move[0]).css({'background-color':move[1]});
        });
        // Event unsubscriben
        return () => {
            socket.off('ludo:throwFigure');
        }
    });
    
    
    const moveFigure = (id) => {
        socket.emit("ludo:clickFigure", id);
        $(".matchfield").find(":button").prop("disabled", true);
    }

    useEffect(() => {
        socket.on("ludo:moveFigure", move => {
            console.log("Figur laufen" + move);
            $(".matchfield").find(":button").html('');
            $("#"+move[2]).css({'background-color':'white'});
            $("#"+move[0]).css({'background-color':move[1]});     
        });

        // Event unsubscriben
        return () => {
            socket.off('ludo:moveFigure');
        }
    });

    useEffect(() => {
        $(".matchfield").find(":button").click((event)=> {
            const id = $(event.currentTarget).attr('id');
            moveFigure(id);
        });
    });

    useEffect(() => {
        socket.on('ludo:nextPlayer', player => {
            setTimeout(function(){
                $('#dice').css({'border-color':player.color});
                $('.dice').html('Würfeln');
            }, 2000);
        });

        // Event unsubscriben
        return () => {
            socket.off('ludo:nextPlayer');
        }
    });

    //Unlock Dice for current Player
    useEffect(()=>{
        socket.on('ludo:unlockDice', (player)=>{
            setTimeout(function(){
                $("#dice").prop("disabled",false);
            }, 2000);
        });

        // Event unsubscriben
        return () => {
            socket.off('ludo:unlockDice');
        }
    });

    const setFirstPlayer = () => {
        socket.emit('ludo:firstPlayer');
    }

    
    if(rules === undefined || players === undefined) {
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
                                    <div className='game-board'>
                                        <br></br>
                                        <button id='firstPlayer' onClick={ setFirstPlayer }>Ersten Spieler festlegen</button>
                                        <br></br>
                                        <button id = "dice" className = 'dice' onClick={ roll }>Würfeln </button>
                                        <Matchfield/>
                                        <div id = "blue">
                                            <House first = '101' second = '102' third = '103' fourth = '104' color = 'blue'/>
                                        </div>
                                        <div id="green">
                                            <House first = '105' second = '106' third = '107' fourth = '108' color = 'green'/>
                                        </div>
                                        <div id="red">
                                            <House first = '109' second = '110' third = '111' fourth = '112' color = 'red'/>
                                        </div>
                                        <div id="yellow">
                                            <House first = '113' second = '114' third = '115' fourth = '116' color = 'yellow'/>
                                        </div>
                                    </div>
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

export default Ludo;