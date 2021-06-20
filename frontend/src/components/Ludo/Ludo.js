import React, { useEffect,  useContext, useState, useCallback } from 'react';
import $, { hasData } from "jquery";

import './Ludo.css'

import Matchfield from './matchfield/matchfield';

import SocketContext from '../../services/socket';

import WuerfelDefault from '../../img/Wuerfeln.png';
import one from '../../img/Wuerfel1_ohneRand.png';
import two from '../../img/Wuerfel2_ohneRand.png';
import three from '../../img/Wuerfel3_ohneRand.png';
import four from '../../img/Wuerfel4_ohneRand.png';
import five from '../../img/Wuerfel5_ohneRand.png';
import six from '../../img/Wuerfel6_ohneRand.png';
import emptyWuerfel from '../../img/Wuerfel1_ohneRand.png';

function Ludo(props) {

    const [gamestatus, setGamestatus] = useState(0);
    const [diceimg, setDiceimg] = useState(WuerfelDefault);
    const [disable, setDisable] = useState(true);

    // Socket.io
    const socket = useContext(SocketContext);
    
    // ersten Spieler anzeigen
    socket.once('ludo:first-player', player => {
        console.log('ludo:firstplayer');
        $('#dice').css({'border-color':player.color});
    });

    //Würfel für ersten Spieler entsperren
    socket.once("ludo:unlockDice-firstPlayer", () =>{
        console.log('ludo:unlockDice');
        setDisable(false);
    });

    // Spielfeld anzeigen
    const handleShowMatchfieldEvent = useCallback(() => {
        console.log('ludo:showMatchfield');
        setGamestatus(1);
    }, []);

    // Augenanzahl des Würfels anzeigen
    const handleDicedValueEvent = useCallback((dice) => {
        console.log('ludo:dicedValue');
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
    }, []);

    //mögliche Züge anzeigen 
    const handleShowMovesEvent = useCallback((show) => {
        console.log('ludo:showMoves');
        show.res.forEach(element => {
            $('#'+element).css({'border-color': show.color});
        })
    }, []);

    //Figuren zum Laufen freischalten
    const handleUnlockMoveFieldsEvent = useCallback((figures) => {
        console.log('ludo:unlockMoveFiled');
        figures.forEach(element =>{
            $("#"+element).prop("disabled", false);
        });
    }, []);

    //Figur aus dem Haus holen
    const handleLeaveHouseEvent = useCallback((move)=> {
        console.log('ludo:leaveHouse');
        $("#"+move[1]).css({'background-color':move[2]});
        $("#"+move[0]).css({'background-color':'white'});
    }, []);

    //Figur schmeißen
    const handleThrowFigureEvent = useCallback((move) => {
        console.log('ludo:throwFigure');
        $("#"+move[0]).css({'background-color':move[1]});
    }, []);

    //Figur laufen
    const handleMoveFigureEvent = useCallback((move) =>{
        console.log('ludo:moveFigure');
        $("#"+move[2]).css({'background-color':''});
        $("#"+move[2]).css({'border-color':''});
        $("#"+move[0]).css({'background-color':move[1]});   
        $('.white').css({'border-color': '#474747'});
        $('.mf-bottom-right').css({'border-color': '#474747'});
        $('.mf-top-right').css({'border-color': '#474747'});
        $('.mf-bottom-left').css({'border-color': '#474747'});
        $('.mf-top-left').css({'border-color': '#474747'});
    }, []);

    //nächsten Spieler anzeigen
    const hanldeNextPlayerEvent = useCallback((player)=>{
        console.log('ludo:nextPlayer');
        setTimeout(function(){
            $('#dice').css({'border-color':player.color});
            setDiceimg(emptyWuerfel);
        }, 2000);
    }, []);

    //Würfel entsperren
    const hanldeUnlockDiceEvent = useCallback(() =>{
        console.log('ludo:unlockDice');
        setTimeout(function(){
            setDiceimg(WuerfelDefault);
            setDisable(false);
        }, 2000);    
    }, []);

    //Spielfiguren entfernen wenn Spieler das Spiel verlässt
    const handlePlayerLeaveEvent = useCallback((positionen) => {
        console.log('ludo:playerleave');
        positionen.forEach(p => {
            $('#'+p[0]).css({'background-color':''});
        });
        $(".matchfield").find(":button").html('');
    }, []);

    //Spielmodus ändern
    const handleModeEvent = useCallback((mode) => {
        if(mode === "Ja"){
            $("#mode_easy").prop('checked', true);
        }else{
            $('#mode_hard').prop('checked', true);
        }
    }, []);

    //Socket Events
    useEffect(() => {
        socket.on('ludo:showMatchfield', handleShowMatchfieldEvent);
        socket.on("ludo:dicedValue", handleDicedValueEvent);
        socket.on('ludo:showMoves', handleShowMovesEvent);
        socket.on('ludo:unlockMoveFields', handleUnlockMoveFieldsEvent);
        socket.on('ludo:leaveHouse', handleLeaveHouseEvent);
        socket.on('ludo:throwFigure', handleThrowFigureEvent);
        socket.on("ludo:moveFigure", handleMoveFigureEvent);
        socket.on('ludo:nextPlayer', hanldeNextPlayerEvent);
        socket.on('ludo:unlockDice', hanldeUnlockDiceEvent);
        socket.on('ludo:playerLeave', handlePlayerLeaveEvent);
        socket.on('ludo:mode', handleModeEvent);

        //Events umounten
        return () => {
            socket.off('ludo:showMatchfield');
            socket.off('ludo:dicedValue');
            socket.off('ludo:showMoves');
            socket.off('ludo:unlockMoveFields');
            socket.off('ludo:leaveHouse');
            socket.off('ludo:throwFigure');
            socket.off('ludo:moveFigure');
            socket.off('ludo:nextPlayer');
            socket.off('ludo:unlockDice');
            socket.off('ludo:playerLeave');
            socket.off('ludo:mode');
        }

    }, [socket, handleShowMatchfieldEvent, handleDicedValueEvent, handleShowMovesEvent, handleUnlockMoveFieldsEvent, handleLeaveHouseEvent, handleThrowFigureEvent, handleMoveFigureEvent, hanldeNextPlayerEvent, hanldeUnlockDiceEvent, handlePlayerLeaveEvent, handleModeEvent]);

    
    useEffect(()=>{
        //Alle Buttons sperren
        $(".matchfield").find(":button").prop("disabled", true);

        // sobald ein Button im Spielfeld geklickt wird, wird die Funktion moveFigur() aufgerufen
        $(".matchfield").find(":button").click((event)=> {
            const id = $(event.currentTarget).attr('id');
            moveFigure(id);
        });

        //Wenn Spielmodus geändert wird
        $(".form-check-input").change(function(){
            const mode = $("input:checked").val();
            socket.emit('ludo:changeMode', {mode:mode});
        });
    });

    // emit -> Würfel geklickt
    const roll = () => {
        socket.emit("ludo:rollDice");
        setDisable(true);
    }
    
    //emit -> Figur die laufen soll
    const moveFigure = (id) => {
        socket.emit("ludo:clickFigure", id);
        $(".matchfield").find(":button").prop("disabled", true);
    }

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
                    <button id="dice" disabled ={disable} onClick={ roll } ><img src={diceimg} height="40px" alt="Würfeln"></img> </button>
                    <Matchfield players={ props.players }/>
                </div>
            </div>
        )
    }
}

export default Ludo;