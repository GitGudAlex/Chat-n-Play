const { getPlayer } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");

module.exports = (io, socket, data) => {
    
    // aktuellen Spieler bekommen
    const player = getPlayer(socket.id);

    // Spieler exestiert noch nicht
    if(player === undefined) return;

    const room = getRoom(player.roomId);

    if(room === undefined) return;

    // Spieler ist gerade dran
    if(room.acticePlayer.socketId === player.socketID) {

        // Karte schwarz -> Darf gelegt werden
        if(data.card.color === 4) {
            placeCard(data.card);

        } else {

            // Gleiche Farbe oder gleiche Zahl
            if(room.cardOnBoard.value === data.card.value || room.cardOnBoard.color === data.card.color) {
                placeCard(data.card);
            }
        }

    // Spieler ist gerade nicht dran
    } else {

        // Exakt gleiche Karte
        if(room.cardOnBoard.value === data.card.value && room.cardOnBoard.color === data.card.color) {
            placeCard(data.card);
        }

    }

    const placeCard = (card) => {
        
        // Besondere Karte
        if(card.isSpecial()) {

            // +2 Karte
            if(card.value === 10) {
                room.cardsCount += 2;
                
            // Reverse Karte
            } else if(card.value === 11) {
                room.isReverse = !room.isReverse;

            // Aussetz Karte
            } else if(card.value === 12) {
                room.isSkip = true;

            // Schwarze Farbe
            } else {

                // +4
                if(card.value === 0) {
                    room.cardsCount += 4;

                // Farbe aussuchen
                } else if(card.value === 1) {
                    

                // Klopf Klopf
                } else if(card.value === 2) {

                }

            }
        }

        room.cardOnBoard = card;
    }

}