// routes/root.js

const express = require('express');
const router = express.Router();
const path = require('path');

// Serve index.html for both / and /index.html
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;