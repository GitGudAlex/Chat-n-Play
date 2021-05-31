const { getPlayer } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");

module.exports = (io, socket) => {
    
    const player = getPlayer(socket.id);

    // Spieler exestiert nicht
    if(player === undefined) return; 

    const room = getRoom(player.roomId);

    // Raum exestiert nicht
    if(room === undefined) return; 

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
                 // Wer dran ist
                io.in(player.roomId).emit('uno:set-next-player', { socketId: room.activePlayer.socketId });

                // Was ein Zug erwartet wird
                io.to(player.socketId).emit('uno:set-move-type', { moveType: room.moveType });
    
            }

        }, 3000);
    }

    setFirstCard(room);

}