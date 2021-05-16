import { useEffect, useLayoutEffect, useRef } from 'react';
import $ from 'jquery';

import './EvaluationItem.css'; 

function EvaluationItem(props) {

    const answersLength = useRef(1);
     
    useEffect(() => {
        answersLength.current = props.content.answers.length;

    }, [props]);

    // Höhe der Item setzten
    useLayoutEffect(() => {
        $('.slf-evaluation-item').height(answersLength.current * 27 + 86 + 'px');
    }, []);

    return (
        <div className='slf-evaluation-item'>
            <p className='slf-evaluation-item-category slf-evaluation-wrapper'>{ props.content.category }</p>
            <div className='slf-evaluation-usernames-wrapper slf-evaluation-wrapper'>
                {
                    props.content.answers.map(entry => (
                        <p key={ entry.socketId } className='slf-evaluation-username'>{ entry.username + ':' }</p>
                    ))
                }
            </div>
            <div className='slf-evaluation-words-wrapper slf-evaluation-wrapper'>
                {
                    props.content.answers.map(entry => (
                        entry.word === '' ? (
                            <p key={ entry.socketId } className='slf-evaluation-words noAnswer'>-</p>
                        ) : (
                            <p key={ entry.socketId } className='slf-evaluation-words'>{ entry.word} </p>
                        )
                    ))
                }
            </div>
            <div className='slf-evaluation-input-wrapper slf-evaluation-wrapper'>
                {
                    props.content.answers.map((entry) => (
                            entry.word.length > 0 ? (
                                <input key={ entry.socketId } type='checkbox'  className='slf-evaluation-input' defaultChecked />
                            ):(
                                <input key={ entry.socketId } type='checkbox'  className='slf-evaluation-input' disabled />
                            )
                    ))
                }
            </div>
        </div>
    );
}

export default EvaluationItem;