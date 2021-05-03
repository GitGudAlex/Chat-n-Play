const { getPlayer, getCurrentPlayerInRoom, nextPlayerInRoom} = require('../../../models/players');
const {moveFigure} = require ('../../../ludo/gamelogic.js');

module.exports = (io, socket, id) => {

    const player = getPlayer(socket.id);

    console.log(id);

    
    const newPosition = moveFigure(id, player);
    //const throwFig = this.playerManager.throwFigure(newPosition);

    console.log("aktueller Spieler: " + player.color);
    console.log("Neue Position: " + newPosition);

    if(getDiceValue(player.roomId) !== 6){
        const nextPlayer = nextPlayerInRoom(player.roomId);
        io.in(player.roomId).emit('ludo:nextPlayer', nextPlayer.color);
    }

    const res = [newPosition, player.color, id];

    io.in(player.roomId).emit('ludo:moveFigure', res);

}