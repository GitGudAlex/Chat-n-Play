import React, { useEffect,  useContext, useState } from 'react';
import $ from "jquery";

import './Ludo.css'

import Matchfield from './matchfield/matchfield';

import WuerfelDefault from '../../img/Wuerfeln.png'

import SocketContext from '../../services/socket';

import one from '../../img/Wuerfel1_ohneRand.png'
import two from '../../img/Wuerfel2_ohneRand.png'
import three from '../../img/Wuerfel3_ohneRand.png'
import four from '../../img/Wuerfel4_ohneRand.png'
import five from '../../img/Wuerfel5_ohneRand.png'
import six from '../../img/Wuerfel6_ohneRand.png'

function Ludo(props) {

    const [gamestatus, setGamestatus] = useState(0);
    const [diceimg, setDiceimg] = useState(WuerfelDefault);

    // Socket.io
    const socket = useContext(SocketContext);
    
    // ersten Spieler anzeigen
    socket.once('ludo:first-player', player => {
        setGamestatus(1);
        $('.dice').css({'border-color':player.color});
        $('#firstPlayer').css({'display':'none'});
        $('#choose_game_mode').css({'display':'none'});
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

    // emit -> Würfel geklickt
    const roll = () => {
        socket.emit("ludo:rollDice");
        $("#dice").prop("disabled", true);   
    }

    // Augenanzahl des Würfels und mögliche Züge anzeigen
    useEffect(() => {
        socket.on("ludo:dicedValue", dice => {
            $('#dice').css({'display':'inline'});
            if(dice === 1){
                setDiceimg(one);
            }else if(dice ===2){
                setDiceimg(two);
            }else if(dice === 3){
                setDiceimg(three);
            }else if(dice === 4){
                setDiceimg(four);
            }else if(dice === 5){
                setDiceimg(five);
            }else{
                setDiceimg(six);
            }
        });
    
        socket.on("ludo:showMoves", show => {
            show.res.forEach(element => {
                $('#'+element).css({'border-color': show.color});
            })
        });

        // Events unsubscriben
        return () => {
            socket.off('ludo:dicedValue');
            socket.off('ludo:showMoves');
        }
    });

    //Figuren zum Laufen freischalten
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

    // Figur aus dem Haus holen
    useEffect(() => {
        socket.on('ludo:leaveHouse', move => {
            $("#"+move[1]).css({'background-color':move[2]});
            $("#"+move[0]).css({'background-color':'white'});
        });

        // Event unsubscriben
        return () => {
            socket.off('ludo:leaveHouse');
        }
    });

    // Figur schmeißen
    useEffect(() => {
        socket.on('ludo:throwFigure', move => {
            $("#"+move[0]).css({'background-color':move[1]});
        });
        // Event unsubscriben
        return () => {
            socket.off('ludo:throwFigure');
        }
    });
    
    //emit -> Figur die laufen soll
    const moveFigure = (id) => {
        socket.emit("ludo:clickFigure", id);
        $(".matchfield").find(":button").prop("disabled", true);
    }

    // Figur laufen
    useEffect(() => {
        socket.on("ludo:moveFigure", move => {
            //$(".matchfield").find(":button").html('');
            $("#"+move[2]).css({'background-color':''});
            $("#"+move[2]).css({'border-color':''});
            $("#"+move[0]).css({'background-color':move[1]});   
            $('.white').css({'border-color': '#474747'});
            $('.mf-bottom-right').css({'border-color': '#474747'});
            $('.mf-top-right').css({'border-color': '#474747'});
            $('.mf-bottom-left').css({'border-color': '#474747'});
            $('.mf-top-left').css({'border-color': '#474747'});
        });

        // Event unsubscriben
        return () => {
            socket.off('ludo:moveFigure');
        }
    });

    // sobald ein Button im Spielfeld geklickt wird, wird die Funktion moveFigur() aufgerufen
    useEffect(() => {
        $(".matchfield").find(":button").click((event)=> {
            const id = $(event.currentTarget).attr('id');
            moveFigure(id);
        });
    });

    // nächsten Spieler anzeigen
    useEffect(() => {
        socket.on('ludo:nextPlayer', player => {
            setTimeout(function(){
                $('#dice').css({'border-color':player.color});
                $('#dice').css({'display':'none'});
            }, 2000);
        });

        // Event unsubscriben
        return () => {
            socket.off('ludo:nextPlayer');
        }
    });

    //Nach dem Würfeln, Würfel entsperren
    useEffect(()=>{
        socket.on('ludo:unlockDice', ()=>{
            setTimeout(function(){
                setDiceimg(WuerfelDefault);
            }, 1950);
            setTimeout(function(){
                $('#dice').css({'display':'inline'});
                $("#dice").prop("disabled",false);
            }, 2000);       
        });

        // Event unsubscriben
        return () => {
            socket.off('ludo:unlockDice');
        }
    });

    //Spieler verlässt Spiel, Spielfiguren werden entfernt
    useEffect(() => {
        socket.on('ludo:playerLeave', (positionen => {
            positionen.forEach(p => {
                $('#'+p[0]).css({'background-color':''});
            });
            $(".matchfield").find(":button").html('');
        }));

        return () => {
            socket.off('ludo:playerLeave');
        }
    });

    //Spielmodus ändern, bei allen Spielern anzeigen
    useEffect(() => {
        socket.on('ludo:mode', (mode => {
            if(mode === "Ja"){
                $("#mode_easy").prop('checked', true);
            }else{
                $('#mode_hard').prop('checked', true);
            }
        }));

        return () => {
            socket.off('ludo:mode');
        }
    });

    //Wenn Spielmodus geändert wird, emit
    useEffect(() => {
        $(".form-check-input").change(function(){
            const mode = $("input:checked").val();
            socket.emit('ludo:changeMode', {mode:mode});
        })
    });

    //Emit -> erster Spieler soll zufällig festgelegt werden
    const setFirstPlayer = () => {
        const mode = $("input:checked").val();
        socket.emit('ludo:firstPlayer', {mode:mode});
    }


    if(gamestatus === 0){
        return (
            <div id='game-content'>
            <div id = 'ludo-selection' className='ludo-selection'>
                <div id = "choose_game_mode">
                    <label>Mögliche Spielzüge sollen vorgeschlagen und angezeigt werden:</label>
                    <br></br>
                    <label>(kann nur vor Spielbeginn geändert werden)</label>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="game_mode" id="mode_easy" value = "Ja"  checked></input>
                        <label class="form-check-label" for="fmode_easy" id ="mode_easy_label">
                            Ja
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="game_mode" id="mode_hard" value = "Nein"  ></input>
                        <label class="form-check-label" for="mode_hard" id ="mode_hard_label">
                            Nein
                        </label>
                    </div>
                </div>
                <br></br>
                <br></br>
                <button id='firstPlayer' className="btn btn-dark" onClick={ setFirstPlayer }>Spiel starten</button>
            </div>
        </div>
        )
    } else if (gamestatus === 1){
        return (
            <div id='game-content'>
                <div id = 'game-board' className = 'game-board'> 
                    <button id="dice" onClick={ roll }><img src={diceimg} height="40px" alt="Würfeln"></img> </button>
                    <Matchfield players={ props.players }/>
                </div>
            </div>
        )
    }
}

export default Ludo;