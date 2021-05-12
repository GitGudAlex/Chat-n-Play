import { useContext, useState, useEffect, useCallback } from 'react';
import './GameBoard.css';

import CategoryInput from './CategoryInput/CategoryInput';
import LetterRoulette from './LetterRoulette/LetterRoulette';

import SocketContext from '../../../services/socket';

function GameBoard(props) {

    const [categories, setCategories] = useState([]);
    const [rounds, setRounds] = useState();
    const [letter, setLetter] = useState();

    // Socket.io
    const socket = useContext(SocketContext);

    useEffect(() => {
        setCategories(props.categories);
        setRounds(props.rounds);

    }, [props]);

    const handleStartRoundEvent = useCallback((data) => {
        setLetter(data.letter);

    }, []);

    // Socket Events
    useEffect(() => { 
        socket.on('slf:start-round', handleStartRoundEvent);
        
    }, [socket, handleStartRoundEvent]);


    if(categories === undefined || rounds === undefined) {
        return (
            <div style={{ height: '100%' }}>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                    <div className="spinner-border" style={{ width: '4rem', height: '4rem' }} role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div id='slf-game-board'>
                <div id='slf-letter-roulette-wrapper'>
                    <LetterRoulette letter={ letter }/>
                </div>
                <div id='slf-categories-input-wrapper'>
                    {
                        categories.map((entry) => (
                            <CategoryInput key={ entry.id } category={ entry.category } />
                        ))
                    }
                </div>
                <div id='slf-submit-btn-wrapper'>
                    <input id='slf-submit-words-btn' className='btn-lg btn-primary' type='button' value='Abgeben' />
                </div>
            </div>
        );
    }
}

export default GameBoard;