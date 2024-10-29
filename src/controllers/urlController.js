// Import the nanoid package
const { nanoid } = require('nanoid');

// Function to handle URL shortening with optional custom alias
async function shortenUrl(req, res) {
    try {
        const { originalUrl, expiresAt, customAlias } = req.body;
        
        // Validate the original URL
        if (!isValidUrl(originalUrl)) {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        const db = req.app.locals.db;

        // Use custom alias if provided; otherwise, generate a unique shortId
        let shortId = customAlias || nanoid(8);
        
        // Check if customAlias or generated shortId is already in use
        const existingEntry = await db.get(`SELECT * FROM urls WHERE shortId = ?`, [shortId]);
        if (existingEntry) {
            return res.status(400).json({ error: 'Custom alias is already in use. Please choose another.' });
        }

        const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;

        // Insert the URL with optional expiresAt and custom alias into the database
        await db.run(
            `INSERT INTO urls (originalUrl, shortUrl, shortId, accessCount, expiresAt) VALUES (?, ?, ?, ?, ?)`,
            [originalUrl, shortUrl, shortId, 0, expiresAt || null]
        );

        res.status(201).json({ originalUrl, shortUrl, expiresAt, customAlias: shortId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

// Helper function to validate URL
function isValidUrl(url) {
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlRegex.test(url);
}

// Function to handle URL redirection with expiration check and access count increment
async function redirectUrl(req, res) {
    try {
        const { shortId } = req.params;
        const db = req.app.locals.db;

        // Retrieve the URL entry by shortId
        const urlEntry = await db.get(`SELECT * FROM urls WHERE shortId = ?`, [shortId]);

        if (!urlEntry) {
            return res.status(404).json({ error: 'URL not found' });
        }

        // Check if the URL has expired
        if (urlEntry.expiresAt && new Date(urlEntry.expiresAt) < new Date()) {
            return res.status(410).json({ error: 'This URL has expired.' });
        }

        // Increment the accessCount and update the entry
        await db.run(`UPDATE urls SET accessCount = accessCount + 1 WHERE shortId = ?`, [shortId]);
        
        // Redirect to the original URL
        res.redirect(urlEntry.originalUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

// Function to retrieve URL statistics
async function getUrlStats(req, res) {
    try {
        const { shortId } = req.params;
        const db = req.app.locals.db;

        // Retrieve the URL statistics
        const urlEntry = await db.get(
            `SELECT originalUrl, shortUrl, accessCount, expiresAt FROM urls WHERE shortId = ?`,
            [shortId]
        );

        if (!urlEntry) {
            return res.status(404).json({ error: 'URL not found' });
        }

        // Respond with URL statistics
        res.status(200).json({
            originalUrl: urlEntry.originalUrl,
            shortUrl: urlEntry.shortUrl,
            accessCount: urlEntry.accessCount,
            expiresAt: urlEntry.expiresAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

// Export all three functions
module.exports = { shortenUrl, redirectUrl, getUrlStats };
