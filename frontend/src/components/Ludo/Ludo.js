import React, { useEffect,  useContext, useState, useCallback, useLayoutEffect } from 'react';
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
import emptyWuerfel from '../../img/empty.png';
import zugVorschau from '../../img/Zug_Vorschau.png'

function Ludo(props) {

    const [gamestatus, setGamestatus] = useState(0);
    const [diceimg, setDiceimg] = useState(emptyWuerfel);
    const [disable, setDisable] = useState(true);

    // Socket.io
    const socket = useContext(SocketContext);
    
    // ersten Spieler anzeigen
    socket.once('ludo:first-player', player => {
        $('#dice').css({'border-color':player.color});
    });

    //Würfel für ersten Spieler entsperren
    socket.once("ludo:unlockDice-firstPlayer", () =>{
        setDisable(false);
        setDiceimg(WuerfelDefault);
        $("#dice").css("animation", "pulse 2s infinite");
    });

    // Spielfeld anzeigen
    const handleShowMatchfieldEvent = useCallback(() => {
        setGamestatus(1);
    }, []);

    // Augenanzahl des Würfels anzeigen
    const handleDicedValueEvent = useCallback((dice) => {
        $("#dice").css("animation", "");
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
        show.res.forEach(element => {
            $('#'+element).css({'border-color': show.color});
        })
    }, []);

    //Figur aus dem Haus holen
    const handleLeaveHouseEvent = useCallback((move)=> {
        $("#"+move[1]).removeClass('img');
        $("#"+move[1]).css({'background-color':move[2]});
        $("#"+move[0]).css({'background-color':'white'});
    }, []);

    //Figur schmeißen
    const handleThrowFigureEvent = useCallback((data) => {
        setTimeout(function(){
            $("#"+data.throwFig[0]).css({'background-color':data.throwFig[1]});
        }, 300*data.dice);
    }, []);

    //Figur laufen
    const handleMoveFigureEvent = useCallback((move) =>{
        let oldPosition = parseInt(move[2]);
        let newPosition = parseInt(move[2]);
        let color = '';

        for(let i = 0; i < move[4]; i ++){
            setTimeout(function(){
                oldPosition = newPosition;
                    if (newPosition === 40 && move[3] === 2){
                        newPosition = 201;
                    }else if (newPosition === 10 && move[3] === 1){
                        newPosition = 205;
                    }else if (newPosition === 20 && move[3] === 3){
                        newPosition = 209;
                    }else if (newPosition === 30 && move[3] === 0){
                        newPosition = 213;
                    }else if (newPosition === 40){
                        newPosition = 1;
                    }else{
                        newPosition = newPosition +1;
                    }
                   
                    $("#"+oldPosition).css({'background-color':color});
                    if (oldPosition === 1 || oldPosition === 11 || oldPosition === 21 | oldPosition === 31){
                        $("#"+oldPosition).addClass('img');
                    }
                    color = $("#"+newPosition).css( "background-color" );
                    $("#"+newPosition).removeClass('img');
                    $("#"+newPosition).css({'background-color':move[1]}); 
            }, 300*i);  
        }
        
        $('.white').css({'border-color': '#474747'});
        $('.mf-bottom-right').css({'border-color': '#474747'});
        $('.mf-top-right').css({'border-color': '#474747'});
        $('.mf-bottom-left').css({'border-color': '#474747'});
        $('.mf-top-left').css({'border-color': '#474747'});
        $("#"+move[2]).css("animation", "");
    }, []);

    //nächsten Spieler anzeigen
    const hanldeNextPlayerEvent = useCallback((player)=>{
        setTimeout(function(){
            $('#dice').css({'border-color':player.color});
            setDiceimg(emptyWuerfel);
        }, 2000);
    }, []);

    //Würfel entsperren
    const hanldeUnlockDiceEvent = useCallback(() =>{
        setTimeout(function(){
            setDiceimg(WuerfelDefault);
            setDisable(false);
            $("#dice").css("animation", "pulse 2s infinite");
        }, 2000);    
    }, []);

    //Spielfiguren entfernen wenn Spieler das Spiel verlässt
    const handlePlayerLeaveEvent = useCallback((positionen) => {
        positionen.forEach(p => {
            $('#'+p[0]).css({'background-color':''});
        });
        $(".matchfield").find(":button").html('');

        $('.white').css({'border-color': '#474747'});
        $('.mf-bottom-right').css({'border-color': '#474747'});
        $('.mf-top-right').css({'border-color': '#474747'});
        $('.mf-bottom-left').css({'border-color': '#474747'});
        $('.mf-top-left').css({'border-color': '#474747'});
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
            socket.off('ludo:leaveHouse');
            socket.off('ludo:throwFigure');
            socket.off('ludo:moveFigure');
            socket.off('ludo:nextPlayer');
            socket.off('ludo:unlockDice');
            socket.off('ludo:playerLeave');
            socket.off('ludo:mode');
        }

    }, [socket, handleShowMatchfieldEvent, handleDicedValueEvent, handleShowMovesEvent, handleLeaveHouseEvent, handleThrowFigureEvent, handleMoveFigureEvent, hanldeNextPlayerEvent, hanldeUnlockDiceEvent, handlePlayerLeaveEvent, handleModeEvent]);

    
    useEffect(()=>{
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

    //Emit -> erster Spieler soll zufällig festgelegt werden
    const setFirstPlayer = () => {
        const mode = $("input:checked").val();
        socket.emit('ludo:firstPlayer', {mode:mode});
    }

    const unlockMatchfield = () => {
        $(".matchfield").find(":button").prop("disabled", false);
    }


    if(gamestatus === 0){
        return (
            <div id='game-content'>
            <div id = 'ludo-selection' className='ludo-selection'>
                <div id = "choose_game_mode">
                    <img src={zugVorschau} id="move-preview"/>
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
                <div className="d-flex justify-content-center">
                    <button id='firstPlayer' className="btn btn-dark" onClick={ setFirstPlayer }>Spiel starten</button>
                </div>
            </div>
        </div>
        )
    } else if (gamestatus === 1){
        return (
            <div id='game-content'>
                <div id = 'game-board' className = 'game-board'> 
                    <button id="dice" style={{ width: '55px', height: '55px' }} disabled ={disable} onClick={ roll } ><img src={diceimg} style={{ width: '35px', height: '35px' }} alt="Würfeln"></img> </button>
                    <Matchfield players={ props.players }/>
                    <button id="unlockMatchfield" onClick={unlockMatchfield}></button>
                </div>
            </div>
        )
    }
}

export default Ludo;