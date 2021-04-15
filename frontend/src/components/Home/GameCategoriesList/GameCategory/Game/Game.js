import './Game.css';

function Game(props) {
    return (
        <div class='m-5'>
            <div>
                <h4>{ props.name }</h4>
            </div>
            <div>
                <p>{ props.description }</p>
            </div>
            <div>
                <button type="button" className="btn btn-primary btn-lg" data-toggle="modal" data-target={ "#create-game-modal-" + props.gameId }>Raum erstellen</button>
            </div>


            {/* Modal */}
            <div className="modal fade" id={ "create-game-modal-" + props.gameId } tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Erstelle ein "{ props.name }" Spiel</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Username" />
                                </div>
                                <div className="form-check m-4">
                                    <input className="form-check-input" type="checkbox" value="" id={ "acceptBtn-" + props.gameId } />
                                    <label className="form-check-label" for={ "acceptBtn-" + props.gameId }>
                                        Hier mit stimme ich zu, dass während des Spiels Aufnahmen gemacht werden dürfen.
                                    </label>
                                </div>
                                <div className='text-center'>
                                    <button type="submit" className="btn btn-primary">Raum erstellen</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Game;