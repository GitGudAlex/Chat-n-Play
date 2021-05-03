const { roll, getDiceValue } = require('../../../ludo/Dice');
const { getPlayer,  nextPlayerInRoom} = require('../../../models/players');
const {checkField, checkHouse, showMove, showFigureFromHouse} = require ('../../../ludo/gamelogic.js');

module.exports = (io, socket) => {
    const player = getPlayer(socket.id);

    roll(player.roomId);

    const dicedValue = getDiceValue(player.roomId);
    io.in(player.roomId).emit('ludo:dicedValue', dicedValue);

    // wägt Sonderfälle ab und berechnet mögliche Züge
    if(checkHouse(player)){
        if(checkField(player.start, player)){
            showMove(getDiceValue(player.roomId), player.start, player);
        }else if(getDiceValue(player.roomId) === 6){
            const pos = showFigureFromHouse(player);
            io.in(player.roomId).emit('ludo:leaveHouse', pos);
            return;
        }else{
            for(let i = 0; i < 4; i++){
                if(player.playerPosition[i][0]<= 40 ||player.playerPosition[i][0]>= 200){
                    showMove(getDiceValue(player.roomId), player.playerPosition[i][0], player);
                }
            }
        }
    }else{
        for(let i = 0; i < 4; i++){
            if(player.playerPosition[i][0]<= 40 ||player.playerPosition[i][0]>= 200){
                showMove(getDiceValue(player.roomId), player.playerPosition[i][0], player);
            }
        }
    }

    // berechnet die Züge für alle übrigen Spielfiguren
    let count = 0;
    let res = [];

    console.log("Playerpositionen " + player.playerPosition);

    for(let i = 0; i < 4; i ++){
        if(player.playerPosition[i][1]!= null){
            let id = player.playerPosition[i][1];
            res.push(id);
            count ++;
        }
    }
    console.log("Anzeigen der möglichen Spielzüge: " + res);

    io.in(player.roomId).emit('ludo:showMoves', res);

    if(res.length === 0){
        const nextPlayer = nextPlayerInRoom(player.roomId);
        io.in(player.roomId).emit('ludo:nextPlayer', nextPlayer.color);
    }
}

