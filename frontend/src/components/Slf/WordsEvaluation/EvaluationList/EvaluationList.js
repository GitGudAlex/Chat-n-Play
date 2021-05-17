import './EvaluationList.css'; 

import EvaluationItem from './EvaluationItem/EvaluationItem.js';

function EvaluationList(props) {

    if(props.answers.length === 0) {
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
                            props.answers.map((entry, index) => (
                                <EvaluationItem key={ index } content={ entry } index={ index } setRatingHandler={ props.setRatingHandler }/>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default EvaluationList;