import React, { useEffect,  useContext } from 'react';
import $ from "jquery";

import './Ludo.css'

import House from './house/house';
import Matchfield from './matchfield/matchfield';

import SocketContext from '../../services/socket';

function Ludo() {

    // Socket.io
    const socket = useContext(SocketContext);

    useEffect(() => { 
        return () => {
            // Wenn man in der Browser historie zurück geht, soll man aus dem Spiel fliegen
            socket.emit('room:leave-room');
        }
    }, [socket])
    
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
                $('.dice').html('Würfeln');
                $("#dice").prop("disabled",false);
            }, 2000);
        });

        // Event unsubscriben
        return () => {
            socket.off('ludo:unlockDice');
        }
    });

    useEffect(() => {
        socket.on('ludo:winner', (player) => {
            $("#dice").prop("disabled", true); 
            $(".matchfield").find(":button").prop("disabled", true);
            console.log("Winner: "+ player.username);
        });

        return () => {
            socket.off('ludo:winner');
        }
    });


    const setFirstPlayer = () => {
        socket.emit('ludo:firstPlayer');
    }
    
    return (
        <div id='game-content'>
            <div className='game-board'>
                <br></br>
                <button id='firstPlayer' onClick={ setFirstPlayer }>Ersten Spieler festlegen</button>
                <br></br>
                <button id = "dice" className = 'dice' onClick={ roll }>Würfeln </button>
                <Matchfield/>
            </div>
        </div>
    )
}

export default Ludo;