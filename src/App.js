// Env Variables
require('dotenv').config();

const fs = require('fs');

// Server
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const PORT = 8080;

// Peer Server
const { ExpressPeerServer } = require('peer');

let peerOptions = {}

if(process.env.NODE_ENV === 'production') {
    peerOptions = {
        proxied: true,
        ssl: {
            key: fs.readFileSync('/etc/ssl/MI/privkey.pem'),
            certificate: fs.readFileSync('/etc/ssl/MI/fullchain.pem')
        }
    };
}

const peerServer = ExpressPeerServer(server, peerOptions);
app.use('/peerjs', peerServer);


// Routes
app.use('/', require('./routes/routesIndex'));

// Socket.io
const io = require("socket.io")(server);
require('./sockets/socket')(io);

server.listen(PORT, function() {
    console.log(`Server running on Port ${PORT}...`);
});
