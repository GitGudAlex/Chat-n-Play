import React, { useLayoutEffect } from 'react';
import $ from 'jquery';

import '../Ludo.css';

function Matchfield(props) {

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

    return(
        <div className = "matchfield">
                <div>
                    <button id = "b39"  className = "white" ></button>
                    <button id = "b40"  className = "white" ></button>
                    <button id = "b1"   className = "mf-top-right" ></button>
                </div>
                <div>
                    <button id = "b38"  className = "white" ></button>
                    <button id = "b201" className = "mf-top-right" ></button>
                    <button id = "b2"   className = "white" ></button>
                </div>
                <div>
                    <button id = "b37"  className = "white" ></button>
                    <button id = "b202" className = "mf-top-right" ></button>
                    <button id = "b3"   className = "white" ></button>
                </div>
                <div>
                    <button id = "b36"  className = "white" ></button>
                    <button id = "b203" className = "mf-top-right" ></button>
                    <button id = "b4"   className = "white" ></button>
                </div>
                <div>
                    <button id = "b31"  className = "mf-top-left" ></button>
                    <button id = "b32"  className = "white" ></button>
                    <button id = "b33"  className = "white" ></button>
                    <button id = "b34"  className = "white" ></button>
                    <button id = "b35"  className = "white" ></button>
                    <button id = "b204" className = "mf-top-right" ></button>
                    <button id = "b5"   className = "white" ></button>
                    <button id = "b6"   className = "white" ></button>
                    <button id = "b7"   className = "white" ></button>
                    <button id = "b8"   className = "white" ></button>
                    <button id = "b9"   className = "white" ></button>
                </div>
                <div>
                    <button id = "b30"  className = "white" ></button>
                    <button id = "b213" className = "mf-top-left" ></button>
                    <button id = "b214" className = "mf-top-left" ></button>
                    <button id = "b215" className = "mf-top-left" ></button>
                    <button id = "b216" className = "mf-top-left" ></button>
                    {/* Würfel */}
                    <button id="buffer"></button>
                    <button id = "b208" className = "mf-bottom-right" ></button>
                    <button id = "b207" className = "mf-bottom-right" ></button>
                    <button id = "b206" className = "mf-bottom-right" ></button>
                    <button id = "b205" className = "mf-bottom-right" ></button>
                    <button id = "b10"  className = "white" ></button>
                </div>
                <div>
                    <button id = "b29"  className = "white" ></button>
                    <button id = "b28"  className = "white" ></button>
                    <button id = "b27"  className = "white" ></button>
                    <button id = "b26"  className = "white" ></button>
                    <button id = "b25"  className = "white" ></button>
                    <button id = "b212" className = "mf-bottom-left" ></button>
                    <button id = "b15"  className = "white" ></button>
                    <button id = "b14"  className = "white" ></button>
                    <button id = "b13"  className = "white" ></button>
                    <button id = "b12"  className = "white" ></button>
                    <button id = "b11"  className = "mf-bottom-right" ></button>
                </div>
                <div>
                    <button id = "b24"  className = "white" ></button>
                    <button id = "b211" className = "mf-bottom-left" ></button>
                    <button id = "b16"  className = "white" ></button>
                </div>
                <div>
                    <button id = "b23"  className = "white" ></button>
                    <button id = "b210" className = "mf-bottom-left" ></button>
                    <button id = "b17"  className = "white" ></button>
                </div>
                <div>
                    <button id = "b22"  className = "white" ></button>
                    <button id = "b209" className = "mf-bottom-left" ></button>
                    <button id = "b18"  className = "white" ></button>
                </div>
                <div>
                    <button id = "b21"  className = "mf-bottom-left" ></button>
                    <button id = "b20"  className = "white" ></button>
                    <button id = "b19"  className = "white" ></button>
                </div>
            </div>
    )
}

export default Matchfield;
