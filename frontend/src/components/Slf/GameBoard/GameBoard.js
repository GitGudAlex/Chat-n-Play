import { useContext, useState, useEffect, useCallback, useRef } from 'react';

import './GameBoard.css';

import CategoryInput from './CategoryInput/CategoryInput';
import LetterRoulette from './LetterRoulette/LetterRoulette';

import SocketContext from '../../../services/socket';

function GameBoard(props) {

    const [categories, setCategories] = useState([]);
    const [rounds, setRounds] = useState();
    const [letter, setLetter] = useState();
    const [inputDisabled, setInputDisabled] = useState(true);

    const words = useRef([]);

    // Socket.io
    const socket = useContext(SocketContext);

    useEffect(() => {
        words.current = []

        for(let category of props.categories) {
            words.current = [...words.current, { id: category.id, word: '' }];
        }

        setCategories(props.categories);
        setRounds(props.rounds);

    }, [props]);

    // Runde Stoppen
    const stopRound = () => {
        console.log("stop round");
        socket.emit('slf:stop-round');
    }

    const changeValue = (event, id) => {
        let index = words.current.findIndex(word => word.id === id);
        words.current[index].word = event.target.value;
    }

    const changeSubmitBtnDisabledState = (state) => {
        setInputDisabled(state);
    }

    const handleStartRoundEvent = useCallback((data) => {
        if(data.letter === undefined) {
            console.log('Spiel schon vorbei!');

        } else {
            setLetter(data.letter);

        }
    }, []);

    const handleRoundEndedEvent = useCallback(() => {
        let result = [];

        for(let entry of words.current) {
            result.push(entry.word);
        }

        socket.emit('slf:submit-words', { words: result });

    }, [socket]);
    
    // Socket Events
    useEffect(() => { 
        socket.on('slf:start-round', handleStartRoundEvent);
        socket.on('slf:round-stopped', handleRoundEndedEvent);
        
        return() => {
            socket.off('slf:start-round');
            socket.off('slf:round-stopped');
        }

    }, [socket, handleStartRoundEvent, handleRoundEndedEvent]);

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
                    <LetterRoulette letter={ letter } submitBtnDisbaledChangeHandler={ changeSubmitBtnDisabledState } />
                </div>
                <div id='slf-categories-input-wrapper'>
                    {
                        categories.map((entry) => (
                            <CategoryInput key={ entry.id }
                                id={ entry.id }
                                category={ entry.category }
                                onChangeHandler={ changeValue } 
                                disabled={ inputDisabled }
                                length={ categories.length }/>
                        ))
                    }
                </div>
                <div id='slf-submit-btn-wrapper'>
                    <input id='slf-submit-words-btn' className='btn-lg btn-primary' type='button' value='Stop!' onClick={ stopRound } disabled={ inputDisabled } />
                </div>
            </div>
        );
    }
}

export default GameBoard;