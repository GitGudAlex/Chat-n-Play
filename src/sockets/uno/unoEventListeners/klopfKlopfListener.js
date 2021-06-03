
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
    if(room.activePlayer.roomId !== socket.id) return;

    // Mehr wie eine bzw. 2 Karten
    if(player.hand.getHandSize() != 2) return;
    
    player.klopfKlopf = true;
}