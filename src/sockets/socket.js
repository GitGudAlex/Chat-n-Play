const roomEvents = require("./room/roomIndex");
const chatEvents = require("./chat/chatIndex");

module.exports = function(io) {
    const onConnection = (socket) => {

        // all room events
        roomEvents(io, socket);

        // all chat events
        chatEvents(io, socket);
    }
    
    io.on("connection", onConnection);
}



  