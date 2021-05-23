// Server
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const PORT = 8080;

// Peer Server
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.use('/peerjs', peerServer);


// Routes
app.use('/', require('./routes/routesIndex'))

// static files
const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

// Socket.io
const io = require("socket.io")(server);
require('./sockets/socket')(io);

server.listen(PORT, function() {
    console.log(`Server running on Port ${PORT}...`);
});
