import './PlayerCorner.css'

function PlayerCorner(props) {

    if(props.color === undefined) {
        return (
            <div className={ props.position + ' player'}>
                <div style={{ border: '3px solid #474747' }} className='camera'>

                </div>
                <div className='player-name'>
                    <p>{ props.username }</p>
                </div>
            </div>
        );
    } else {
        return (
            <div className={ props.position + ' player'}>
                <div style={{ border: '3px solid ' + props.color }} className='camera'>
    
                </div>
                <div className='player-name'>
                    <p>{ props.username }</p>
                </div>
            </div>
        );
    }
}

export default PlayerCorner;