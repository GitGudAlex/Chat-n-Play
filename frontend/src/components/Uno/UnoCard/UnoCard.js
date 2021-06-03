import './UnoCard.css';

function UnoCard(props) {

    // Unbekannte Karte
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

        // Karte auf der Hand
        if(props.card.rotation === undefined) {
            return (
                <div id={ props.card.id + '-uno-card' } className={ 'uno-card ' + (props.hidden === true ? 'invisible' : '') }>
                    <div className='uno-card-front'>
                        <img src={ '/UnoCardsImages/' + props.card.path } alt={ 'Farbe ' + props.card.color + ' und Wert ' + props.card.value }/>
                    </div>
                </div>
            );

        // Karte nicht auf der Hand
        } else {

            let rotationStyle = {
                transform: 'rotateZ(' + props.card.rotation + 'deg)'
            }

            // Karte liegt auf dem Kartenstapel
            if(props.flip === undefined) {
                return (
                    <div id={ props.card.id + '-uno-card' } className={ 'uno-card ' + (props.hidden === true ? 'invisible' : '') } style={ rotationStyle }>
                        <div className='uno-card-front'>
                            <img src={ '/UnoCardsImages/' + props.card.path } alt={ 'Farbe ' + props.card.color + ' und Wert ' + props.card.value }/>
                        </div>
                    </div>
                );

            // Karte wird auf den Kartenstapel gelegt
            } else {
                console.log("animate");
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
}

export default UnoCard;