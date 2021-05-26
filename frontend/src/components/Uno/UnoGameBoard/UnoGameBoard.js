import { useCallback, useContext, useEffect } from 'react';

import './UnoGameBoard.css';

import SocketContext from "../../../services/socket";

function UnoGameBoard(props) {

    // Socket.io
    const socket = useContext(SocketContext);

    // Karten mischen
    const handlingDealStartHand = useCallback((data) => {
        console.log(data.hand);
    }, []);

    // Der Server liefert einen zufälligen Start Spieler -> Animation abspielen
    const handlingSetStartPlayer = useCallback((data) => {

    }, []);

    useEffect(() => {
        socket.on('uno:deal-start-hand', handlingDealStartHand);
        socket.on('uno:set-start-player', handlingSetStartPlayer);

        return () => {
            socket.off('uno:deal-start-hand', handlingDealStartHand);
            socket.off('uno:set-start-player', handlingSetStartPlayer);
        }
    }, [socket, handlingDealStartHand, handlingSetStartPlayer]);

    return (
        <div id='uno-decks-wrapper'>
            <div id='uno-deck-playing-cards' className='uno-deck-wrapper'>
                <img className='uno-deck' src='/UnoCardsImages/-1.png' alt='Playing Cards' />
            </div>
            <div id='uno-deck-played-cards' className='uno-deck-wrapper'>

            </div>
        </div>
    );
}

export default UnoGameBoard;