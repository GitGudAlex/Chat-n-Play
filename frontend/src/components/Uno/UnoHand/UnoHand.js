import { useState, useCallback, useLayoutEffect, useEffect } from 'react';
import $ from 'jquery';

import './UnoHand.css';

import UnoCard from '../UnoCard/UnoCard';

function UnoHand(props) {

    // Breite und Höhe der Spieler Kamera
    const [playerWidth, setPlayerWidth] = useState();
    const [playerHeight, setPlayerHeight] = useState();

    const resizeHandHandler = useCallback(() => {
        if(props.top) {
            setPlayerWidth($('.player').width());

        } else {
            setPlayerHeight($('.player').height());

        }

    }, [props.top]);

    // Width setzten bei Windows resize event
    useLayoutEffect(() => {

        // Wenn die Fenstergröße geändert wird -> Größe anpassen
        window.addEventListener('resize', resizeHandHandler);

        return () => {
            window.removeEventListener('resize', resizeHandHandler);
        }

    }, [resizeHandHandler]);

    // Width setzten am Anfang
    useEffect(() => {

        if(props.self) {
            setPlayerWidth($('.player').width());

        } else {
            // Spieler der sich oben befindet
            if(props.top) {
                setPlayerWidth($('.player').width());

            // Spieler der sich unten befindet
            } else {
                setPlayerHeight($('.player').height());
            }
        }

    }, [props.top, props.self]);

    // Styling setzten
    let posStyle;

    // Eigene Hand
    if(props.self) {

        // Card height
        let cardHeight = $('.uno-card').height();

        posStyle = {
            left: playerWidth + 80 + 'px',
            right: playerWidth + 80 + 'px',
            height: cardHeight + 'px'
        }

        return(
            <div id='uno-own-hand' className='uno-my-hand-wrapper' style={ posStyle }>
                <div id={ props.socketId + '-uno-player' } className='uno-my-hand'>
                    {
                        props.cards.map((card) => {
                            return (
                                <div className='uno-my-card-wrapper' key={ card.id }>
                                    <UnoCard card={ card } />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    if(props.top) {

        // oben + links
        if(props.left) {
            posStyle = {
                top: '40px',
                left: playerWidth + 80 + 'px'
            }

        // oben + rechts
        } else {
            posStyle = {
                top: '40px',
                right: playerWidth + 80 + 'px'
            }

        }
    } else {
        // unten + links
        if(props.left) {
            posStyle = {
                bottom: playerHeight + 80 + 'px',
                left: '40px'
            }

        // unten + rechts
        } else {
            posStyle = {
                bottom: playerHeight + 80 + 'px',
                right: '40px'
            }

        }
    }


    return (
        <div id={ props.socketId + '-uno-player' } className='uno-other-hand' style={ posStyle }>
            {
                props.cards.map((card) => {
                    return (
                        <div className='uno-other-card-wrapper' key={ card.id }>
                            <UnoCard card={ card } />
                        </div>
                    )
                })
            }
            <div className='uno-other-card-wrapper'>
                <img id={ 'uno-deck-ref-' + props.socketId } className='uno-card-small invisible' src={ '/UnoCardsImages/-1.png' } alt='' />
            </div>
        </div>
    );
}

export default UnoHand;