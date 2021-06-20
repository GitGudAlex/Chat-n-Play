import React, { useContext, useLayoutEffect } from 'react';
import $ from 'jquery';

import '../Ludo.css';
import SocketContext from '../../../services/socket';

function Matchfield(props) {

    // Socket.io
    const socket = useContext(SocketContext);

    useLayoutEffect(() => {

        // Alle möglichen Positionen
        const positions = ['top-left', 'bottom-right', 'top-right', 'bottom-left'];

        // Alle Möglichen Farben
        const colors = [{ hex: '#FCA701', color: 'yellow' },
            { hex: '#00BF02', color: 'green'},
            { hex: '#FF3030', color: 'red' },
            { hex: '#0B97F0', color: 'blue' }];

        // durch Spieler iterieren und deren Positionen bekommen um die Spielfelder farbig zu machen
        for(let player of props.players) {
            let position = player.position;
            let colorindex = colors.findIndex(c => c.hex === player.color);

           $('.mf-' + positions[position]).addClass(colors[colorindex].color + '-light');
        }

    }, [props]);

    //emit -> Figur die laufen soll
    const moveFigure = (event) => {
        const id = event.target.id;
        socket.emit("ludo:clickFigure", id);
        $(".matchfield").find(":button").prop("disabled", true);
    }

    return(
        <div className = "matchfield">
                <div>
                    <button id = "39"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "40"  onClick = {moveFigure} className = "white middle" ></button>
                    <button id = "1"   onClick = {moveFigure} className = "mf-top-right start" ></button>
                </div>
                <div>
                    <button id = "38"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "201" onClick = {moveFigure} className = "mf-top-right" ></button>
                    <button id = "2"   onClick = {moveFigure} className = "white" ></button>
                </div>
                <div>
                    <button id = "37"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "202" onClick = {moveFigure} className = "mf-top-right" ></button>
                    <button id = "3"   onClick = {moveFigure} className = "white" ></button>
                </div>
                <div>
                    <button id = "36"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "203" onClick = {moveFigure} className = "mf-top-right" ></button>
                    <button id = "4"   onClick = {moveFigure} className = "white" ></button>
                </div>
                <div>
                    <button id = "31"  onClick = {moveFigure} className = "mf-top-left start" ></button>
                    <button id = "32"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "33"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "34"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "35"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "204" onClick = {moveFigure} className = "mf-top-right" ></button>
                    <button id = "5"   onClick = {moveFigure} className = "white" ></button>
                    <button id = "6"   onClick = {moveFigure} className = "white" ></button>
                    <button id = "7"   onClick = {moveFigure} className = "white" ></button>
                    <button id = "8"   onClick = {moveFigure} className = "white" ></button>
                    <button id = "9"   onClick = {moveFigure} className = "white" ></button>
                </div>
                <div>
                    <button id = "30"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "213" onClick = {moveFigure} className = "mf-top-left" ></button>
                    <button id = "214" onClick = {moveFigure} className = "mf-top-left" ></button>
                    <button id = "215" onClick = {moveFigure} className = "mf-top-left" ></button>
                    <button id = "216" onClick = {moveFigure} className = "mf-top-left" ></button>
                    {/* Würfel */}
                    <button id="buffer"></button>
                    <button id = "208" onClick = {moveFigure} className = "mf-bottom-right" ></button>
                    <button id = "207" onClick = {moveFigure} className = "mf-bottom-right" ></button>
                    <button id = "206" onClick = {moveFigure} className = "mf-bottom-right" ></button>
                    <button id = "205" onClick = {moveFigure} className = "mf-bottom-right" ></button>
                    <button id = "10"  onClick = {moveFigure} className = "white" ></button>
                </div>
                <div>
                    <button id = "29"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "28"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "27"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "26"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "25"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "212" onClick = {moveFigure} className = "mf-bottom-left" ></button>
                    <button id = "15"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "14"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "13"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "12"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "11"  onClick = {moveFigure} className = "mf-bottom-right start" ></button>
                </div>
                <div>
                    <button id = "24"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "211" onClick = {moveFigure} className = "mf-bottom-left" ></button>
                    <button id = "16"  onClick = {moveFigure} className = "white" ></button>
                </div>
                <div>
                    <button id = "23"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "210" onClick = {moveFigure} className = "mf-bottom-left" ></button>
                    <button id = "17"  onClick = {moveFigure} className = "white" ></button>
                </div>
                <div>
                    <button id = "22"  onClick = {moveFigure} className = "white" ></button>
                    <button id = "209" onClick = {moveFigure} className = "mf-bottom-left" ></button>
                    <button id = "18"  onClick = {moveFigure} className = "white" ></button>
                </div>
                <div>
                    <button id = "21"  onClick = {moveFigure} className = "mf-bottom-left start" ></button>
                    <button id = "20"  onClick = {moveFigure} className = "white middle" ></button>
                    <button id = "19"  onClick = {moveFigure} className = "white" ></button>
                </div>
            </div>
    )
}

export default Matchfield;
