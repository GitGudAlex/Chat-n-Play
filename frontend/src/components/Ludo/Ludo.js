import React, { useEffect,  useContext } from 'react';
import './Ludo.css'
import $ from "jquery";
import House from './house/house';
import Matchfield from './matchfield/matchfield';
import Title from '../Home/Title/Title';

import SocketContext from '../../services/socket';

function Ludo(){

    // Socket.io
    const socket = useContext(SocketContext);

    socket.once('ludo:current-player', color => {
        console.log('color' + color);
        $('.dice').css({'border-color':color});
        $('#firstPlayer').css({'display':'none'});
    });

    const roll = () => {
        socket.emit("ludo:rollDice");   
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
    })

    useEffect(() => {
        socket.on('ludo:leaveHouse', move => {
            console.log("Positionen aus dem Loch: " + move);
            $("#"+move[1]).css({'background-color':move[2]});
            $("#"+move[0]).css({'background-color':'white'});
        });
    })
    
    
    const moveFigure = (id) => {
        socket.emit("ludo:clickFigure", id);
    }

    useEffect(() => {
        socket.on("ludo:moveFigure", move => {
            console.log("Figur laufen" + move);
            $(".matchfield").find(":button").html('');
            $("#"+move[2]).css({'background-color':'white'});
            $("#"+move[0]).css({'background-color':move[1]});     
        });
    })

    useEffect(() => {
        $(".matchfield").find(":button").click((event)=> {
            const id = $(event.currentTarget).attr('id');
            moveFigure(id);
        });
    })

    useEffect(() => {
        socket.on('ludo:nextPlayer', color => {
            $('#dice').css({'border-color':color});
        });
    });

    const setFirstPlayer = () => {
        socket.emit('ludo:firstPlayer');
    }
    
    return (
        <div>
            <header className="lobby-header">
                <Title text="Ludo" height="10vh" fontSize="4vw"/>
            </header>
            <br></br>
            <button id='firstPlayer' onClick = {setFirstPlayer}>Ersten Spieler festlegen</button>
            <br></br>
            <button id = "dice" className = 'dice' onClick = {roll}>Würfeln</button>
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
    )
}

export default Ludo;