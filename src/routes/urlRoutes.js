const express = require('express');
const router = express.Router();
const { shortenUrl, redirectUrl, getUrlStats } = require('../controllers/urlController');

// Route to create a shortened URL
router.post('/shorten', shortenUrl);

// Route to redirect to the original URL using the short ID
router.get('/:shortId', redirectUrl);

// Route to get statistics for a specific shortened URL
router.get('/stats/:shortId', getUrlStats);

module.exports = router;
