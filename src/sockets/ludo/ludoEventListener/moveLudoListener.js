const { getPlayer, nextPlayerInRoom} = require('../../../models/players');
const {moveFigure, throwFigure} = require ('../../../ludo/gamelogic.js');

module.exports = (io, socket, id) => {

    const player = getPlayer(socket.id);
    const nextPlayer = nextPlayerInRoom(player.roomId);

    console.log(id);

    
    const newPosition = moveFigure(id, player);
    const throwFig = throwFigure(newPosition, player);

    console.log("aktueller Spieler: " + player.color);
    console.log("Neue Position: " + newPosition);
    console.log("ThrowFigure-emit:" + throwFig);

    if(getDiceValue(player.roomId) !== 6){
        io.in(player.roomId).emit('ludo:nextPlayer', nextPlayer);
    }

    const res = [newPosition, player.color, id];

    io.in(player.roomId).emit('ludo:moveFigure', res);
    io.to(nextPlayer.socketId).emit("ludo:unlockDice", nextPlayer);

    if(throwFig.length > 0){
        io.in(player.roomId).emit('ludo:throwFigure', throwFig);
    }

}