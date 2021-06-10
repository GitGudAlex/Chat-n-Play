const roomEvents = require("./room/roomIndex");
const webcamEvents = require("./webcam/webcamIndex")
const chatEvents = require("./chat/chatIndex");
const ludoEvents = require("./ludo/ludoIndex")
const unoEvents = require("./uno/unoIndex")
const slfEvents = require("./slf/slfIndex")
const footerEvents = require("./footer/footerIndex")

module.exports = function(io) {
    const onConnection = (socket) => {
        
        // all room events
        roomEvents(io, socket);

        // all webcam events
        webcamEvents(io, socket);

        // all chat events
        chatEvents(io, socket);

        // all ludo events
        ludoEvents(io, socket);

        // all slf events
        unoEvents(io, socket);

        // all slf events
        slfEvents(io, socket);

        footerEvents(io, socket);
    }
    
    io.on("connection", onConnection);
}



  