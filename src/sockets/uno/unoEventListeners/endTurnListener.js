const { getPlayer } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");
const { setNextPlayer } = require("../../../uno/gameLogic");

module.exports = (io, socket) => {

    // aktuellen Spieler bekommen
    const player = getPlayer(socket.id);

    // Spieler exestiert noch nicht
    if(player === undefined) return;

    // aktuellen Raum bekommen
    const room = getRoom(player.roomId);

    // Raum exestiert nicht
    if(room === undefined) return;

    // Falsches Spiel
    if(room.gameTypeId !== 1) return;

    // Noch nicht gestartet
    if(room.hasStarted === false) return;

    // Spieler nicht an der Reihe
    if(room.activePlayer.socketId !== socket.id) return;

    // Spiel noch nicht angefangen
    if(room.cardOnBoard === 0) return;

    // Nur den Zug beenden, wenn man auch eine Karte gezogen hat
    if(player.didDrawCard === false) return; 

    if(player.active === false) return;

    // Spieler kann nicht mehr interagieren
    player.active = false;

    // Nächsten Spieler setzten
    setNextPlayer(io, room.roomId);
}