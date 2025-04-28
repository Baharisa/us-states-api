const express = require('express');
const router = express.Router();
const path = require('path');

// Serve index.html normally
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// Optionally, also allow /index.html explicitly
router.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;
