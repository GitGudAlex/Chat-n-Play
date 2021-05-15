import './WordsEvaluation.css'; 

import EvaluationList from './EvaluationList/EvaluationList';

function WordsEvaluation(props) {
    if(props.words === undefined || props.categories === undefined) {
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
            <div id='slf-words-evaluation-wrapper'>
                <div id='slf-words-evaluation-additional-informations-wrapper'>
                    <div className='slf-evaluate-letter-wrapper'>
                        <p className='slf-evaluate-letter'>{ 'Buchstabe: ' + props.letter.toUpperCase() }</p>
                    </div>
                    <div className='slf-state-describtion-wrapper'>
                        <p className='slf-state-describtion'>Bewerte die Antworten deiner Freunde</p>
                    </div>
                </div>
                <div id='slf-evaluation-wrapper'>
                    <EvaluationList words={ props.words } categories={ props.categories } players={ props.players }/>
                </div>
                <div id='slf-submit-evaluated-words-btn-wrapper'>
                    <input id='slf-submit-evaluated-words-btn' className='btn-lg btn-primary' type='button' value='Fertig' />
                </div>
            </div>
        );
    }
}

export default WordsEvaluation;