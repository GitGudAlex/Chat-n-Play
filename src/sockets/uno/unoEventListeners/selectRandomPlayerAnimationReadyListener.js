const { getPlayer } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");

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

    const setFirstCard = (room) => {

        // Karte vom Deck nehmen
        let card = room.deck.takeCard();
        room.cardOnBoard = card;
    
        // socketId = 0 heißt, dass die Karte vom kartenstapel kommt (Für die nimation wichtig)
        // Sonst handelt es sich hierbei um eine SocketId um die Animation richtig abzuspielen
        io.in(player.roomId).emit('uno:deal-card', { card: card, socketId: 0 });
    
        setTimeout(() => {
            // Wenn es sich um eine Spezial Karte handelt -> neue Karte legen
            if(card.isSpecial()) {
                setFirstCard(room);
    
            // Sonst kann der erste Spieler anfangen zu Spielen
            } else {

                // Was ein Zug erwartet wird
                io.to(player.socketId).emit('uno:set-move-type', { moveType: room.moveType });
    
            }

        }, 2000);
    }

    setFirstCard(room);

}