const socket = io();
let roomId = -1;

// Läd alle möglichen Spiele und setzt die Sichtbarkeiten der Elemnte
function setup() {

    // Event, wenn man Nachrichten schicken will wenn man enter klickt
    $("#chatInput").keypress(function(event) {
        if (event.keyCode === 13) {
            sendMessage();
        }
    });

    // Läd alle Spiele
    $.get(`http://localhost:8080/games`, function( data ) {
        data.forEach(element => {
            $("#gameSelectionWrapper").append(`<input class="gameItem" type="button" value="${ element.name }" onclick="showNameInput(${ element.id })">`);
        });
    });

    // Sichtbarkeiten setzten
    $("#lobby").hide();
    $("#createGameInput").hide();
}


// Wird aufgerufen, wenn ein Spiel ausgewählt wurde um die Eingabe für den usernamen anzuzeigen
function showNameInput(gameTypeId) {
    $("#gameSelectionWrapper").hide();
    $("#joinGameWrapper").hide();
    $("#createGameInput").show();

    $.get(`http://localhost:8080/games/description?id=${ gameTypeId }`, function( data ) {
        if(data.error !== undefined) {
            alert("Das ausgewählte Spiel exestiert nicht!");

        } else {
            document.getElementById('gameNameOutput').innerHTML = data.name;
            document.getElementById('gameDescriptionOutput').innerHTML = data.description;
            document.getElementById('createGameBtn').setAttribute("onclick", `createGame(${ gameTypeId })`);
        }
    });

}


// Wenn man ein Spiel erstellt und seinen Namen eingeben muss, und man dann zurück will
function goHome() {
    $("#gameSelectionWrapper").show();
    $("#joinGameWrapper").show();
    $("#createGameInput").hide();
}


// Wird aufgerufen wenn ein Spiel erstellt werden soll
function createGame(gameTypeId) {
    socket.emit('room:create', { gameTypeId: gameTypeId }, (error) => {
        if(error) {
            alert(error);
        }
    });
}


// Raum auf der Server Seite erstellt
socket.on('room:created', function(data) {
    let username = document.getElementById('createPlayerNameInput').value;
    roomId = data.roomId;

    socket.emit('room:join', { roomId: data.roomId, username }, (error) => {
        if(error) alert(error);
    });
});


// Einem exestierendem Spiel beitreten
function joinGame() {
    roomId = document.getElementById('roomIdInput').value;
    let username = document.getElementById('joinPlayerNameInput').value;

    socket.emit('room:join', { roomId, username }, (error) => {
        if(error) alert(error);
    });
}


// Wenn der Spieler dem Raum gejoined ist
socket.on('room:joined', function(data) {
    $("#home").hide();
    $("#lobby").show();

    $("#history").append(`<p>Die RaumId ist: ${ roomId }</p>`);
    $("#players").html('');
    
    (data.players).forEach(player => {
        if(player.socketId == data.hostId) {
            $("#players").append(`<p>${ player.username } [Host]</p>`);

        } else {
            $("#players").append(`<p>${ player.username }</p>`);

        }
    });

    // Läd Spiel Informationen
    $.get(`http://localhost:8080/games/game?id=${ data.gameTypeId }`, function( gameData ) {
        document.getElementById('gameNameLobbyOutput').innerHTML = gameData.name;
        document.getElementById('gameRules').innerHTML = gameData.rules;
    });

    if(data.hostId != socket.id) {
        document.getElementById("gameStartBtn").disabled = true;
    }

});

// Wenn der Host sich ändert
socket.on('room:hostChanged', function(data) {
    if(data.hostId == socket.id) {
        document.getElementById("gameStartBtn").disabled = false;
    }
});


// Wenn ein Spieler dem Raum gejoined ist -> Spieler updaten
socket.on('room:update', function(data) {
    
    $("#players").html('');

    (data.players).forEach(player => {
        if(player.socketId == data.hostId) {
            $("#players").append(`<p>${ player.username } [Host]</p>`);

        } else {
            $("#players").append(`<p>${ player.username }</p>`);

        }
    });
    
});

// Chat Funktion
socket.on('chat:message', function(data) {
    let text = '';

    // Systemnachricht
    if(data.player == '') {
        text = data.text;

    // Nachricht von einem Spieler
    } else {
        text = data.player + ': ' + data.text;

    }
    
    $("#history").append(`<p>${ text }</p>`);

});

function sendMessage() {
    const text = document.getElementById('chatInput').value;
    socket.emit('chat:sendMessage', { text });

    document.getElementById('chatInput').value = '';
}
