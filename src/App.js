// Server
const express = require('express');
const app = express();
const server = require('http').createServer(app); 

app.use(express.static(__dirname + '/public'));

//add default route to always return index.html if no matching api target (SPA)
app.get('/getText', (req, res)=>{
    res.send({text: "Hallo :)"});
})

server.listen(8080, function() {
    console.log(`Server running on Port 8080...`);
});
