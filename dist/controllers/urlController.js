"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlStats = exports.redirectUrl = exports.shortenUrl = void 0;
// Controller to handle URL shortening
const shortenUrl = (req, res) => {
    res.send('Shortened URL created');
};
exports.shortenUrl = shortenUrl;
// Controller to handle redirection of shortened URLs
const redirectUrl = (req, res) => {
    res.send('Redirecting to original URL');
};
exports.redirectUrl = redirectUrl;
// Controller to get statistics of a shortened URL
const getUrlStats = (req, res) => {
    res.send('URL statistics');
};
exports.getUrlStats = getUrlStats;
