const roomEvents = require("./room/roomIndex");
const chatEvents = require("./chat/chatIndex");
const ludoEvents = require("./ludo/ludoIndex")
const slfEvents = require("./slf/slfIndex")

module.exports = function(io) {
    const onConnection = (socket) => {
        
        // all room events
        roomEvents(io, socket);

        // all chat events
        chatEvents(io, socket);

        // all ludo events
        ludoEvents(io, socket);

        // all slf events
        slfEvents(io, socket);
    }
    
    io.on("connection", onConnection);
}



  