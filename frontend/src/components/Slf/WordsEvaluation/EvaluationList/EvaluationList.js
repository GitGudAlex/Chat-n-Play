import { useEffect, useState } from 'react';
import './EvaluationList.css'; 

import EvaluationItem from './EvaluationItem/EvaluationItem.js';

function EvaluationList(props) {

    /**
     * id, category, 
     */
    const [answers, setAnswers] = useState([]);
    
    useEffect(() => {
        let result = [];

        for(let catIndex in props.categories) {
            let resultJson = { category: props.categories[catIndex].category, answers: [] }

            for(let p of props.players) {
                let playerAnswerJson = { socketId: p.socketId, username: p.username }

                let playerAnswer = props.words.find(entry => entry.socketId === p.socketId);
                playerAnswerJson['word'] = playerAnswer.words[catIndex].word;
                playerAnswerJson['votes'] = playerAnswer.words[catIndex].votes;

                resultJson.answers.push(playerAnswerJson);
            }

            result.push(resultJson);
        }


        console.log(result);
        setAnswers(result);

    }, [props]);


    const setRating = (categoryIndex, socketId, rating) => {
        let socketIndex = answers[categoryIndex].answers.find(entry => entry.socketId === socketId);

        answers[categoryIndex].answers[socketIndex].votes = rating;
    }


    if(answers.length === 0) {
        return (
            <div className='slf-evaluation'>
                <div style={{ height: '100%' }}>
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                        <div className="spinner-border" style={{ width: '4rem', height: '4rem' }} role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );

    } else {
        return (
            <div className='slf-evaluation'>
                <div>
                    <div className='slf-evaluation-list'>
                        {
                            answers.map((entry, index) => (
                                <EvaluationItem key={ index } content={ entry } index={ index } setRatingHandler={ setRating }/>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default EvaluationList;