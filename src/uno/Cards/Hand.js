class Hand {
    constructor() {
        this.hand = [];
  
    }

    // Wenn ein Spieler eine Karte zieht, diese Karte auf die Hand legen
    addCard(card) {
        this.hand.push(card);
    }

    // Wenn der Spieler einer Karte abgibt
    discard(index) {
        this.hand.splice(index, 1);
    }

    // Die Anzahl der Karten zurückgebgen
    getHandSize() {
        return this.hand.length;
    }
}

module.exports = { Hand }