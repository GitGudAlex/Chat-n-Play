const express = require('express')
const router = express.Router();

const fs = require('fs');
const path = require('path');

// get all available games (returns id + gamenames)
router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname + '/../data/gameInfos.json'), 'utf8', (err, json) => {
        if (err) throw err;

        try {
            const obj = JSON.parse(json);
            const games = obj.map(game => ({ id: game.id, name: game.name }));

            res.json(games);

        } catch(err) {
            res.json({ "error": "Ein Fehler ist aufgetreten" });
        }
    });
})

// get the description to a game (returns name + description)
router.get('/game', (req, res) => {
    fs.readFile(path.join(__dirname + '/../data/gameInfos.json'), 'utf8', (err, json) => {
        if (err) throw err;
        
        try {
            const obj = JSON.parse(json);
            const game = obj.find(game => game.id == req.query.id);

            res.json(game);

        } catch(err) {
            res.json({ "error": "Ein Fehler ist aufgetreten" });
        }
    });
})

// get all games from a specific types{ card, board } (returns gamenames)
router.get('/type', (req, res) => {
    fs.readFile(path.join(__dirname + '/../data/gameInfos.json'), 'utf8', (err, json) => {
        if (err) throw err;

        try {
            const obj = JSON.parse(json);
            const games = obj.filter(game => game.type == req.query.gameType).map(game => ({ id: game.id, name: game.name }));

            res.json(games);

        } catch(err) {
            res.json({ "error": "Ein Fehler ist aufgetreten" });
        }
    });
})

// get the description to a game (returns name + description)
router.get('/description', (req, res) => {
    fs.readFile(path.join(__dirname + '/../data/gameInfos.json'), 'utf8', (err, json) => {
        if (err) throw err;

        try {
            const obj = JSON.parse(json);
            const game = obj.find(game => game.id == req.query.id);
            
            res.json({ "id": game.id, "name": game.name, "description": game.description });

        } catch(err) {
            res.json({ "error": "Ein Fehler ist aufgetreten" });
        }
    });
})

// get the rules to a game (returns rules)
router.get('/rules', (req, res) => {
    fs.readFile(path.join(__dirname + '/../data/gameInfos.json'), 'utf8', (err, json) => {
        if (err) throw err;
        
        try {
            const obj = JSON.parse(json);
            const game = obj.find(game => game.id == req.query.id);

            res.json({ "id": game.id, "name": game.name, "description": game.rules });

        } catch(err) {
            res.json({ "error": "Ein Fehler ist aufgetreten" });
        }
    });
})

// Export the Router
module.exports = router