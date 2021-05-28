import { useEffect, useState } from 'react';
import $ from 'jquery';

import './UnoCard.css';

function UnoCard(props) {

    const [animationDone, setAnimationDone] = useState(false);

    useEffect(() => {
        // Animation abspielen
        if(props.fromId !== undefined && props.toId !== undefined) {

            // Laufzeit
            let duration = 500;

            // Startzeitpunkt der Animation
            let startTime;

            // Breite der Karte hohlen
            let width = 100;
            let height = 152;

            // X Werte -> Verschiebung
            let startPosAbsX = $('#' + props.fromId).position().left;
            let endPosAbsX = $('#' + props.toId).position().left;
            let startPositionX = endPosAbsX - startPosAbsX + width / 2;

            let endPositionX = 0;

            // Y Werte -> Verschiebung
            let startPosAbsY = $('#' + props.fromId).position().top;
            let endPosAbsY = $('#' + props.toId).position().top;
            let startPositionY = endPosAbsY - startPosAbsY - height / 2;

            let endPositionY = 0;

            // Z Rotation
            let startRotationZ = 0;
            let endRotationZ = props.card.rotation;

            // Y Rotation
            let startRotationY = 0;
            let endRotationY = -180;

            // Animationsfunktion
            const easeOutCirc = (x) => {
                return 1 - (1 - x) * (1 - x);
            }

            const initAnimation = (timestamp) => {
                startTime = timestamp;

                $('#' + props.card.id + '-animate-wrapper').css({ transform: 'translate(-' + startPositionX + 'px, ' + startRotationY + 'px) rotateZ(' + startRotationZ + 'deg)' });
                $('#' + props.card.id + '-animate').css({ transform: 'rotateY(' + startRotationY + 'deg)' });

                $('#' + props.card.id + '-animate-wrapper').removeClass('invisible');

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
                    
                    $('#' + props.card.id + '-animate-wrapper').css({ transform: 'translate(-' + posX + 'px, ' + posY + 'px) rotateZ(' + rotZ + 'deg)' } );
                    $('#' + props.card.id + '-animate').css({ transform: 'rotateY(' + rotY + 'deg)' });

                    requestAnimationFrame(animate);

                } else {
                    setAnimationDone(true);

                }
            }

            requestAnimationFrame(initAnimation);

        }
    }, [props.fromId, props.toId, props.card]);

    // Keine Animation
    if(props.fromId === undefined && props.toId === undefined) {

        // Karte unbekannt -> Nur Rückseite anzeigen
        if(props.card === undefined) {

            return (
                <div className='uno-card' >
                    <div className='uno-card-back'>
                        <img src={ '/UnoCardsImages/-1.png' } alt={ 'Rückseite der Karte' }/>
                    </div>
                </div>
            );
        }

        let rotationStyle = {
            transform: 'rotateZ(' + props.card.rotation + 'deg)'
        }

        // Karte bekannt -> Karte anzeigen
        return (
            <div className='uno-card' style={ rotationStyle } >
                <div className='uno-card-animate-wrapper' >
                    <div className='uno-card-front'>
                        <img src={ '/UnoCardsImages/' + props.card.path } alt={ 'Farbe ' + props.card.color + ' und Wert ' + props.card.value } />
                    </div>
                </div>
            </div>
        );
    }

    // Animation

    // Karte soll geflippt werden
    if(props.flip) {
        return (
            <div id={ props.card.id + '-animate-wrapper' } className='uno-card invisible' >
                <div id={ props.card.id + '-animate' } className='uno-card-animate-wrapper' >
                    <div className='uno-card-front uno-card-hidden'>
                        <img src={ '/UnoCardsImages/' + props.card.path } alt={ 'Farbe ' + props.card.color + ' und Wert ' + props.card.value } />
                    </div>
                    <div className='uno-card-back'>
                        <img src={ '/UnoCardsImages/-1.png' } alt={ 'Rückseite der Karte' }/>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id={ props.card.id + '-animate-wrapper' } className='uno-card invisible' >
            <div className='uno-card-noflip-wrapper' >
                <div className='uno-card-front uno-card-hidden'>
                    <img src={ '/UnoCardsImages/' + props.card.path } alt={ 'Farbe ' + props.card.color + ' und Wert ' + props.card.value } />
                </div>
                <div className='uno-card-back'>
                    <img src={ '/UnoCardsImages/-1.png' } alt={ 'Rückseite der Karte' }/>
                </div>
            </div>
        </div>
    );
}

export default UnoCard;