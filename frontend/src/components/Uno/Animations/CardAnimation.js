const { data } = require('jquery');
const $ = require('jquery');

const animateCard = (fromId, toId, card, animationDuration, flip, scaling, callback) => {

    // Laufzeit
    let duration = animationDuration;

    // Startzeitpunkt der Animation
    let startTime;

    let sidebarWidth = $('#sidebar-wrapper').width();
    let titleHeight = $('#titleWrapper').height();

    let fromElement = $('#' + fromId).offset();
    let toElement = $('#' + toId).offset();

    // X Werte -> Verschiebung
    let startPosAbsX = fromElement.left - sidebarWidth;
    let endPosAbsX = toElement.left - sidebarWidth;

    // Y Werte -> Verschiebung
    let startPosAbsY = fromElement.top - titleHeight;
    let endPosAbsY = toElement.top - titleHeight;

    $('#from').css({ left: startPosAbsX + 'px', top: startPosAbsY + 'px' });
    $('#to').css({ left: endPosAbsX + 'px', top: endPosAbsY + 'px' });

    // Z Rotation
    let startRotationZ = 0;
    let endRotationZ = card.rotation;

    // Y Rotation
    let startRotationY = 0;
    let endRotationY = -180;

    // X Scaling
    let startScaleX = $('#' + fromId).width();
    let endScaleX = $('#' + toId).width();

    // Y Scaling
    let startScaleY = $('#' + fromId).height();
    let endScaleY = $('#' + toId).height();

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

        if(scaling) {
            $('#' + card.id + '-animate').css({ width: startScaleX + 'px' });
            $('#' + card.id + '-animate').css({ height: startScaleY + 'px' });
        }

        $('#' + card.id + '-animate-wrapper').removeClass('invisible');

        requestAnimationFrame(animate);
    }

    const animate = (timestamp) => {
        if(timestamp - startTime < duration) {
            let p = (timestamp - startTime) / duration;
            let val = easeOutCirc(p);

            // Für das verschieben in X Richtung
            let posX = startPosAbsX + (endPosAbsX - startPosAbsX) * val;

            // Für das verschieben in Y Richtung
            let posY = startPosAbsY + (endPosAbsY - startPosAbsY) * val;

            // Für die Z Rotation
            let rotZ = startRotationZ + (endRotationZ - startRotationZ) * val;

            // Für die Y Rotation
            let rotY = startRotationY + (endRotationY - startRotationY) * val;

            // Für die X Scaling
            let scalX = startScaleX + (endScaleX - startScaleX) * val;

            // Für die Y Scaling
            let scalY = startScaleY + (endScaleY - startScaleY) * val;

            if(card.rotation !== undefined) {
                $('#' + card.id + '-animate-wrapper').css({ transform: 'rotateZ(' + rotZ + 'deg)' });
            }

            if(flip) {
                $('#' + card.id + '-animate').css({ transform: 'rotateY(' + rotY + 'deg)' });
            }

            if(scaling) {
                $('#' + card.id + '-animate').css({ width: scalX + 'px' });
                $('#' + card.id + '-animate').css({ height: scalY + 'px' });

            }

            $('#' + card.id + '-animate-wrapper').css({ left: posX + 'px' });
            $('#' + card.id + '-animate-wrapper').css({ top: posY + 'px' });

            requestAnimationFrame(animate);

        } else {
            //$('#' + card.id + '-animate-wrapper').addClass('invisible');
            callback();
        }
    }

    requestAnimationFrame(initAnimation);
}

module.exports = { animateCard }