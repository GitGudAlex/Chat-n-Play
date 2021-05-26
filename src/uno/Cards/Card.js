class Card {
    constructor(value, color) {
        this.id = color * 14 + value;
        this.value = value;
        this.color = color;
        this.path = (color * 14 + value) + '.png';
    }
}

module.exports = { Card }