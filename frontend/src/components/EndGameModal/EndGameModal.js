import $ from 'jquery';

import { useLayoutEffect } from 'react';
import './EndGameModal.css';

function EndGameModal(props) {

    useLayoutEffect(() => {
        $('#endgame-modal').modal({backdrop: 'static', keyboard: false})  
        $('#endgame-modal').modal('show');
        
    }, []);

    if(props.winnsers === undefined) {
        return (
            <div>
            </div>
        );
    }

    return (
        <div className="modal fade" id="endgame-modal" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        {
                            props.winners.length === 1 ? (
                                <h5 className="modal-title" id="endgame-modal-title">{ props.winners[0].username + ' hat gewonnen!' }</h5>
                            ) : (
                                props.winners.map((p, index) => {
                                    if(index === props.winners.length - 1) {
                                        return <h5>{ p.username }</h5>

                                    } else {
                                        return <h5>{ p.username + ', ' }</h5>
                                        
                                    }
                                })
                            )
                        }
                        <h5 className="modal-title" id="endgame-modal-title">Gewonnen hat</h5>
                    </div>
                    <div className="modal-body">
                        ...
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EndGameModal;