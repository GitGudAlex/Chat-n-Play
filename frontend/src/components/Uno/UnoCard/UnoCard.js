import './UnoCard.css';

function UnoCard(props) {

    // Statische Karte 
    if(props.animate === undefined) {

        // Unbekannte Karte auf der Hand eines anderen Spielers
        if(props.card.value === undefined) {
            return (
                <div id={ props.card.id + '-uno-card' } className={ 'uno-card ' + (props.hidden === true ? 'invisible' : '') }>
                    <div className='uno-card-back'>
                        <img src={ '/UnoCardsImages/-1.png' } alt={ 'Rückseite der Karte' }/>
                    </div>
                </div>
            );

        // Bekannte Karte
        } else {

            // Karte auf meiner Hand
            if(props.card.rotation === undefined) {
                return (
                    <div id={ props.card.id + '-uno-card' } className={ 'uno-card ' + (props.hidden === true ? 'invisible' : '') }>
                        <div className='uno-card-front'>
                            <img src={ '/UnoCardsImages/' + props.card.path } alt={ 'Farbe ' + props.card.color + ' und Wert ' + props.card.value }/>
                        </div>
                    </div>
                );

            // Karte nicht auf meiner Hand
            } else {
                let rotationStyle = {
                    transform: 'rotateZ(' + props.card.rotation + 'deg)'
                }
    
                // Karte liegt auf dem Kartenstapel
                return (
                    <div id={ props.card.id + '-uno-card' } className={ 'uno-card ' + (props.hidden === true ? 'invisible' : '') } style={ rotationStyle }>
                        <div className='uno-card-front'>
                            <img src={ '/UnoCardsImages/' + props.card.path } alt={ 'Farbe ' + props.card.color + ' und Wert ' + props.card.value }/>
                        </div>
                    </div>
                );
            }
        }

    // Karte wird animiert
    } else {

        let rotation = props.card.rotation === undefined ? 0 : props.card.rotation;

        let rotationStyle = {
            transform: 'rotateZ(' + rotation + 'deg)'
        }

        // Karte vom Kartenstapel zu einem Gegenspieler => Karte unbekannt
        if(props.card.value === undefined) {
            return (
                <div id={ props.card.id + '-animate-wrapper' } className={ 'uno-card ' + (props.hidden === true ? 'invisible' : '') } style={ rotationStyle }>
                    <div id={ props.card.id + '-animate' } className='uno-card-animate' >
                        <div className='uno-card-back'>
                            <img src={ '/UnoCardsImages/-1.png' } alt={ 'Rückseite der Karte' }/>
                        </div>
                    </div>
                </div>
            );

        // Karte bekannt
        } else {
            return (
                <div id={ props.card.id + '-animate-wrapper' } className={ 'uno-card ' + (props.hidden === true ? 'invisible' : '') } style={ rotationStyle }>
                    <div id={ props.card.id + '-animate' } className='uno-card-animate' >
                        <div className='uno-card-front uno-card-hidden'>
                            <img src={ '/UnoCardsImages/' + props.card.path } alt={ 'Farbe ' + props.card.color + ' und Wert ' + props.card.value } />
                        </div>
                        <div className='uno-card-back'>
                            <img src={ '/UnoCardsImages/-1.png' } alt={ 'Rückseite der Karte' }/>
                        </div>
                    </div>
                </div>
            );
        }

    }
}

export default UnoCard;