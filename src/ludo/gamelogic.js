//Überprüfen ob mind. eine Figur im Haus ist
checkHouse = (currentPlayer) => {
    for(let i = 0; i < 4; i ++){
        if(currentPlayer.house[i][1] === true){
            console.log('checkHouse true'); 
            return true;
        }
    console.log('checkHouse false');
    return false;
    }
}

//Überprüfen ob eine eigene Spielfigur auf dem Feld steht
checkField = (position, currentPlayer) => {
    for (let i = 0; i < 4; i ++){
        if(currentPlayer.playerPosition[i][0] === position){
            console.log("Checkfield() true " + currentPlayer.playerPosition[i][0]);
            return true;
        }else{
            console.log("Checkfield() false " + currentPlayer.playerPosition[i][0]);
        }
    }
    return false;
}

showMove = (dice, position, currentPlayer) => {
    console.log('Dice:' + dice);
    console.log('position' + position);
    console.log('currentPlayer' + currentPlayer);
    let newPosition = position;

    for(let i = 0; i < dice; i ++){
        if (newPosition === 40 && currentPlayer.position === 2){
            newPosition = 201;
        }else if (newPosition === 10 && currentPlayer.position === 1){
            newPosition = 205;
        }else if (newPosition === 20 && currentPlayer.position === 3){
            newPosition = 209;
        }else if (newPosition === 30 && currentPlayer.position === 0){
            newPosition = 213;
        }else if (newPosition === 40){
            newPosition = 1;
        }else if(newPosition === 204 || newPosition === 208 || newPosition === 212 || newPosition === 216){
            newPosition = null; 
            break;
        }else{
            newPosition = newPosition +1;
        }
    }

    //überprüfen, ob eigene Figur auf dem Zielfeld steht
    if(checkField(newPosition, currentPlayer)){
        newPosition = null;
    }

    for (let i = 0; i < 4 ; i ++){
        if(currentPlayer.playerPosition[i][0] === position){
            currentPlayer.playerPosition[i][1] = newPosition;
            break;
        }
    }
    console.log("CurrentPlayer - neue berechnete Spielerpositionen " + currentPlayer.playerPosition);
    //möglichen Spielzug für die Spielfigur berechnen und potentielles Zielfeld anzeigen
}

showFigureFromHouse = (currentPlayer) => {
    let pos = [];
    for(let i = 3; i >= 0; i --){
        if (currentPlayer.house[i][1] === true){
            pos[0] = currentPlayer.playerPosition[i][0];
            currentPlayer.playerPosition[i][0] = currentPlayer.start;
            pos[1] = currentPlayer.start;
            currentPlayer.house[i][1] = "false";
            pos[2] = currentPlayer.color;
            console.log("Array-pos: " + pos);
            return pos;
        }
    }
    // eine Figur aus dem Haus auf das Startfeld
    return pos;
}

moveFigure = (id, currentPlayer) => {
    let buttonid = null;
    for (let i = 0; i < 4 ; i ++){
        if(currentPlayer.playerPosition[i][0] == id){
            buttonid = currentPlayer.playerPosition[i][1];
            currentPlayer.playerPosition[i][0] = buttonid;
        }
        currentPlayer.playerPosition[i][1] = null;
    }
    
    console.log("Position nach dem Zug: " + currentPlayer.playerPosition);


    return buttonid;
}

/*
throwFigure(position){

    console.log("throw Figure wird aufgerufen");

    let pos = []

    this.players.forEach(player => {
        console.log("Schritt 1");
        if(player !== this.currentPlayer){
            console.log("Schritt 2");
            for( let i = 0; i < 4; i ++){
                if(player.position[i][0] == position){
                    console.log("Schritt 3");
                    const housePos = this.getFirstPosHole(player.house);
                    player.position[i][0] = housePos;
                    pos.push(housePos, player.color);
                    console.log("Die Figur: " + housePos + " wird geschmissen: " + player.color);
                }
            }
        }
    })
    console.log("throwFigure: " + pos);
    return pos;
}
*/

getFirstPosHole = (house) => {
    house.forEach(pos => {
        console.log("House-false: " + pos);
        console.log(pos[1])
        if (pos[1] === false){
            console.log("testtesttest")
            pos[1] = true; 
            return pos[0]
        }
        })
}
    


module.exports = {checkField, checkHouse, showMove, showFigureFromHouse, moveFigure, getFirstPosHole};