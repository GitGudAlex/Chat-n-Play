import { useEffect, useRef, useState } from 'react';
import $ from 'jquery';

import './LetterRoulette.css';

function LetterRoulette(props) {

    const [alphabet, setAlphabet] = useState([]);
    const position = useRef(0);

    useEffect(() => {
        setAlphabet([...'abcdefghijklmnopqrstuvwxyza']);
    }, []);

    useEffect(() => {
        if(props.letter !== undefined) {

            // Laufzeit der Hauptanimation in Sekunden
            let duration = 2;

            // Speed von der SlowDown Animation
            let slowDownSpeed = 5000;

            // Ob die Animation gerade langsamer wird
            let isSlowdown = false;

            // Berechnung der untersten Position des Buchstaben Arrays, die man anzeigen lassen kann
            let allItemsHeight = $('#slf-roulette-inner').height();
            let itemHeight = $('#slf-roulette').height();
            let maxPosition = allItemsHeight - itemHeight;

            // Position, bei dem das Rad stehen bleiben muss
            let destIndex = alphabet.findIndex((l) => l === props.letter);
            let destPos = destIndex * itemHeight;
            let slowDownStartPos = null;

            // Geschwindikeit der Hauptanimation
            let stepsize = 20;

            // Startpunkt der SlowDown Animation
            let slowdownStart = null;

            // Gibt die Distanz an vomn StartPunkt der Slowdown Animation bis zu dem ausgewählten Buchstaben
            let slowdownDistance = null;

            // Variable damit nur einemal die Slowdown init Methode durchlaufen wird
            let initSlowdown = true;

            const easeOutSine = (x) => {
                return Math.sin((x * Math.PI) / 2);
            }

            const roll = (timestamp) => {
                    // Animation ist noch am Abspielensss
                if(timestamp - slowdownStart < slowDownSpeed || slowdownStart === null) {

                    // Bewegt sich normal
                    if(!isSlowdown) {
                        position.current = (position.current + stepsize);
                        $('#slf-roulette-inner').css({ top: - (position.current % maxPosition) + 'px' });

                        // Bewegt sich langsamer
                    } else {
                        if(initSlowdown) {
                            slowdownDistance =  maxPosition - ((position.current % maxPosition) - destPos);
                            destPos = position.current + slowdownDistance;
                            slowdownStart = timestamp;
                            slowDownStartPos = position.current;
                            initSlowdown = false;

                        } else {
                            let p = (timestamp - slowdownStart) / slowDownSpeed;
                            let val = easeOutSine(p);
                            let x = slowDownStartPos + (destPos - slowDownStartPos) * val;
                            $('#slf-roulette-inner').css({ top: - (x % maxPosition) + 'px' });
                        }
                    }

                    requestAnimationFrame(roll);

                // Animation vorbei
                } else {

                    // Damit die Werte nicht zu groß werden
                    position.current = (position.current % maxPosition);

                    // Placeholder anzeigen lassen bei den Kategorie Inputs
                    $('.slf-category-input-guess').attr('placeholder', props.letter.toUpperCase() + '...');

                    return;

                }
            }

            requestAnimationFrame(roll);
            setTimeout(() => {
                isSlowdown = true;

            }, duration * 1000);
        }

    }, [props, alphabet] );

    const itemStyle = {
        color: props.letter === undefined ? 'rgb(139, 139, 139)' : '#444'
    }

    return (
        <div id='slf-roulette-container'>
            <div id='slf-roulette'>
                <div id='slf-roulette-inner'>
                    {
                        alphabet.map((letter, index) => (
                            <div key={ index } className='slf-roulette-item' style={itemStyle}>{ letter.toUpperCase() }</div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default LetterRoulette;