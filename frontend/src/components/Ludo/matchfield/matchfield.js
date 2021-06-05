import { css } from 'jquery';
import $ from "jquery";
import React from 'react';
import '../Ludo.css';


function Matchfield(){

    return(
        <div className = "matchfield">
                <div>
                    <button id = "39"  className = "white" ></button>
                    <button id = "40"  className = "white" ></button>
                    <button id = "1"   className = "mf-top-right" ></button>
                </div>
                <div>
                    <button id = "38"  className = "white" ></button>
                    <button id = "201" className = "mf-top-right" ></button>
                    <button id = "2"   className = "white" ></button>
                </div>
                <div>
                    <button id = "37"  className = "white" ></button>
                    <button id = "202" className = "mf-top-right" ></button>
                    <button id = "3"   className = "white" ></button>
                </div>
                <div>
                    <button id = "36"  className = "white" ></button>
                    <button id = "203" className = "mf-top-right" ></button>
                    <button id = "4"   className = "white" ></button>
                </div>
                <div>
                    <button id = "31"  className = "mf-top-left" ></button>
                    <button id = "32"  className = "white" ></button>
                    <button id = "33"  className = "white" ></button>
                    <button id = "34"  className = "white" ></button>
                    <button id = "35"  className = "white" ></button>
                    <button id = "204" className = "mf-top-right" ></button>
                    <button id = "5"   className = "white" ></button>
                    <button id = "6"   className = "white" ></button>
                    <button id = "7"   className = "white" ></button>
                    <button id = "8"   className = "white" ></button>
                    <button id = "9"   className = "white" ></button>
                </div>
                <div>
                    <button id = "30"  className = "white" ></button>
                    <button id = "213" className = "mf-top-left" ></button>
                    <button id = "214" className = "mf-top-left" ></button>
                    <button id = "215" className = "mf-top-left" ></button>
                    <button id = "216" className = "mf-top-left" ></button>
                    {/* Würfel */}
                    <button id="buffer"></button>
                    <button id = "208" className = "mf-bottom-right" ></button>
                    <button id = "207" className = "mf-bottom-right" ></button>
                    <button id = "206" className = "mf-bottom-right" ></button>
                    <button id = "205" className = "mf-bottom-right" ></button>
                    <button id = "10"  className = "white" ></button>
                </div>
                <div>
                    <button id = "29"  className = "white" ></button>
                    <button id = "28"  className = "white" ></button>
                    <button id = "27"  className = "white" ></button>
                    <button id = "26"  className = "white" ></button>
                    <button id = "25"  className = "white" ></button>
                    <button id = "212" className = "mf-bottom-left" ></button>
                    <button id = "15"  className = "white" ></button>
                    <button id = "14"  className = "white" ></button>
                    <button id = "13"  className = "white" ></button>
                    <button id = "12"  className = "white" ></button>
                    <button id = "11"  className = "mf-bottom-right" ></button>
                </div>
                <div>
                    <button id = "24"  className = "white" ></button>
                    <button id = "211" className = "mf-bottom-left" ></button>
                    <button id = "16"  className = "white" ></button>
                </div>
                <div>
                    <button id = "23"  className = "white" ></button>
                    <button id = "210" className = "mf-bottom-left" ></button>
                    <button id = "17"  className = "white" ></button>
                </div>
                <div>
                    <button id = "22"  className = "white" ></button>
                    <button id = "209" className = "mf-bottom-left" ></button>
                    <button id = "18"  className = "white" ></button>
                </div>
                <div>
                    <button id = "21"  className = "mf-bottom-left" ></button>
                    <button id = "20"  className = "white" ></button>
                    <button id = "19"  className = "white" ></button>
                </div>
            </div>
    )
}

export default Matchfield;
