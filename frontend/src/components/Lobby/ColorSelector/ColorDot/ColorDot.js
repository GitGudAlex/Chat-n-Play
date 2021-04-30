import './ColorDot.css';

function ColorDot(props) {
    
    // Ausgewählte Farbe
    if(props.owner === props.socketId) {
        return (
            <div className='color-dot-wrapper'>
                <button style={{ border: '2px solid black', backgroundColor: props.color }} type="button" className="color-dot rounded-circle" onClick={ () => props.setColorMethod(props.color) }></button>
            </div>
        );
    }

    // Frei verfügbare Farbe
    if(props.owner === undefined) {
        return (
            <div className='color-dot-wrapper'>
                <button style={{ backgroundColor: props.color }} type="button" className="color-dot rounded-circle" onClick={ () => props.setColorMethod(props.color) }></button>
            </div>
        );

    // Vergebene Farbe
    } else {
        return (
            <div className='color-dot-wrapper'>
                <button style={{ backgroundColor: 'gray' }} type="button" className="color-dot rounded-circle"></button>
            </div>
        );
    }
}

export default ColorDot;