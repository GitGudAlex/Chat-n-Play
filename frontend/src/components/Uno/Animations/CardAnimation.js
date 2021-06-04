const { data } = require('jquery');
const $ = require('jquery');

const animateCard = (fromId, toId, card, animationDuration, flip, scaling, callback) => {

    // Laufzeit
    let duration = animationDuration;

    // Startzeitpunkt der Animation
    let startTime;

    // Breite der Karte hohlen
    let sidebarWidth = $('#sidebar-wrapper').width();

    var fromElement = document.getElementById(fromId).getBoundingClientRect();
    var toElement = document.getElementById(toId).getBoundingClientRect();

    // X Werte -> Verschiebung
    let startPositionX = 0;

    let startPosAbsX = fromElement.left - sidebarWidth;
    let endPosAbsX = toElement.left - sidebarWidth;
    let endPositionX = endPosAbsX - startPosAbsX;

    // Y Werte -> Verschiebung
    let startPositionY = 0;
    
    let startPosAbsY = fromElement.top;
    let endPosAbsY = toElement.top;
    let endPositionY = endPosAbsY - startPosAbsY;

    // Z Rotation
    let startRotationZ = 0;
    let endRotationZ = card.rotation;

    // Y Rotation
    let startRotationY = 0;
    let endRotationY = -180;

    // Animationsfunktion
    const easeOutCirc = (x) => {
        return 1 - (1 - x) * (1 - x);
    }

    const initAnimation = (timestamp) => {
        startTime = timestamp;

        $('#' + card.id + '-animate-wrapper').css({ left: startPosAbsX + 'px' });
        $('#' + card.id + '-animate-wrapper').css({ top: startPosAbsY + 'px' });

        if(data.card !== undefined) {
            $('#' + card.id + '-animate-wrapper').css({ transform: 'rotateZ(' + startRotationZ + 'deg)' });
        }

        if(flip) {
            $('#' + card.id + '-animate').css({ transform: 'rotateY(' + startRotationY + 'deg)' });
        }

        $('#' + card.id + '-animate-wrapper').removeClass('invisible');

        requestAnimationFrame(animate);
    }

    const animate = (timestamp) => {
        if(timestamp - startTime < duration) {
            let p = (timestamp - startTime) / duration;
            let val = easeOutCirc(p);

            // Für das verschieben in X Richtung
            let posX = startPositionX + (endPositionX - startPositionX) * val;

            // Für das verschieben in Y Richtung
            let posY = startPositionY + (endPositionY - startPositionY) * val;

            // Für die Z Rotation
            let rotZ = startRotationZ + (endRotationZ - startRotationZ) * val;

            // Für die Y Rotation
            let rotY = startRotationY + (endRotationY - startRotationY) * val;
            
            $('#' + card.id + '-animate-wrapper').css({ left: startPosAbsX + posX + 'px' });
            $('#' + card.id + '-animate-wrapper').css({ top: startPosAbsY + posY + 'px' });

            if(card.rotation !== undefined) {
                $('#' + card.id + '-animate-wrapper').css({ transform: 'rotateZ(' + rotZ + 'deg)' });
            }

            if(flip) {
                $('#' + card.id + '-animate').css({ transform: 'rotateY(' + rotY + 'deg)' });
            }

            requestAnimationFrame(animate);

        } else {
            //$('#' + card.id + '-animate-wrapper').addClass('invisible');
            callback();
        }
    }

    requestAnimationFrame(initAnimation);
}

module.exports = { animateCard }