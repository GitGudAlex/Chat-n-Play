// Einem exestierendem Spiel beitreten
function joinGame() {
    roomId = document.getElementById('roomIdInput').value;
    let username = document.getElementById('joinPlayerNameInput').value;

    socket.emit('room:join', { roomId, username }, (error) => {
        if(error) alert(error);
    });
}


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
