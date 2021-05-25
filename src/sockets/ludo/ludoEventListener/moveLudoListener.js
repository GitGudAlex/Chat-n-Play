const { getPlayer, nextPlayerInRoom, getCurrentPlayerInRoom} = require('../../../models/players');
const {moveFigure, throwFigure, checkWinner} = require ('../../../ludo/gamelogic.js');
const { getRoom } = require('../../../models/rooms');

module.exports = (io, socket, id) => {

    const player = getPlayer(socket.id);

    const newPosition = moveFigure(id, player);
    const throwFig = throwFigure(newPosition, player);
    const winner = checkWinner(player);
    const room = getRoom(player.roomId);

    if(winner){
        room.gameStatus = 2;
        io.in(player.roomId).emit("ludo:winner", player);
    }

    if(getDiceValue(player.roomId) !== 6){
        const nextPlayer = nextPlayerInRoom(player.roomId, player);
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