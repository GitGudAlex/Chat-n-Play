const express = require('express')
const router = express.Router()

const path = require('path');

// Routing fot game informations (available games, description of the games...)
router.use('/games', require('./games'))

// add default route to always return index.html if no matching api target (SPA)
router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '../../public/index.html'));
})

// Export Router
module.exports = router