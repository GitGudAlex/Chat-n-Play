const { getPlayer, nextPlayerInRoom, getCurrentPlayerInRoom} = require('../../../models/players');
const {moveFigure, throwFigure, checkWinner} = require ('../../../ludo/gamelogic.js');

module.exports = (io, socket, id) => {

    const player = getPlayer(socket.id);

    console.log(id);

    
    const newPosition = moveFigure(id, player);
    const throwFig = throwFigure(newPosition, player);
    const winner = checkWinner(player);

    console.log("aktueller Spieler: " + player.color);
    console.log("Neue Position: " + newPosition);
    console.log("ThrowFigure-emit:" + throwFig);

    if(winner){
        io.in(player.roomId).emit("ludo:winner", player);
    }

    if(getDiceValue(player.roomId) !== 6){
        const nextPlayer = nextPlayerInRoom(player.roomId);
        io.in(player.roomId).emit('ludo:nextPlayer', nextPlayer);
        io.to(nextPlayer.socketId).emit("ludo:unlockDice", nextPlayer);
    }else{
        io.to(player.socketId).emit("ludo:unlockDice", player);
    }

    const res = [newPosition, player.color, id];

    io.in(player.roomId).emit('ludo:moveFigure', res);

    if(throwFig.length > 0){
        io.in(player.roomId).emit('ludo:throwFigure', throwFig);
    }

}