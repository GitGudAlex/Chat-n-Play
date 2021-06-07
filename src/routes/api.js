const express = require('express')
const router = express.Router();

const fs = require('fs');
const path = require('path');

// get all available games (returns id + gamenames)
router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname + '/../data/games.json'), 'utf8', (err, json) => {
        if (err) console.log(err);

        try {
            const obj = JSON.parse(json);
            const games = obj.map(game => ({ id: game.id, name: game.name }));

            res.json(games);

        } catch(err) {
            res.json({ "error": "Ein Fehler ist aufgetreten" });
        }
    });
})

// get all Game Categories (id + name)
router.get('/gamecategories', (req, res) => {
    fs.readFile(path.join(__dirname + '/../data/gameCategories.json'), 'utf8', (err, json) => {
        if (err) console.log(err);
        
        try {
            const obj = JSON.parse(json);
            const gameGategories = obj.map(gameCategory => ({ gameCategoryId: gameCategory.gameCategoryId, gameCategoryName: gameCategory.gameCategoryName, color: gameCategory.color, img: gameCategory.img , imgbg1: gameCategory.imgbg1, imgbg2: gameCategory.imgbg2}));

            res.json(gameGategories);

        } catch(err) {
            res.json({ "error": "Ein Fehler ist aufgetreten" });
        }
    });
})

// get all games from a specific category{ card, board, ... } (returns game names and descriptions of the games)
router.get('/category', (req, res) => {
    fs.readFile(path.join(__dirname + '/../data/games.json'), 'utf8', (err, json) => {
        if (err) console.log(err);

        try {
            const obj = JSON.parse(json);
            const games = obj.filter(game => game.gameCategoryId == req.query.gameCategoryId).map(game => ({ id: game.id, name: game.name, description: game.description }));

            res.json(games);

        } catch(err) {
            res.json({ "error": "Ein Fehler ist aufgetreten" });
        }
    });
})

// get the name of a game
router.get('/name', (req, res) => {
    fs.readFile(path.join(__dirname + '/../data/games.json'), 'utf8', (err, json) => {
        if (err) console.log(err);
        
        try {
            const obj = JSON.parse(json);
            const game = obj.find(game => game.id == req.query.id);

            res.json({ name: game.name });

        } catch(err) {
            res.json({ "error": "Ein Fehler ist aufgetreten" });
        }
    });
})


// get tge rules of a game
router.get('/rules', (req, res) => {
    fs.readFile(path.join(__dirname + '/../data/games.json'), 'utf8', (err, json) => {
        if (err) console.log(err);
        
        try {
            const obj = JSON.parse(json);
            const game = obj.find(game => game.id == req.query.id);

            res.json({ rules: game.rules });

        } catch(err) {
            res.json({ "error": "Ein Fehler ist aufgetreten" });
        }
    });
})

// Export the Router
module.exports = router