"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const urlController_1 = require("../controllers/urlController");
const router = (0, express_1.Router)();
// Route to shorten a URL
router.post('/shorten', urlController_1.shortenUrl);
// Route to redirect a shortened URL to the original URL
router.get('/:shortUrl', urlController_1.redirectUrl);
// Route to get statistics for a specific shortened URL
router.get('/stats/:shortUrl', urlController_1.getUrlStats);
exports.default = router;
