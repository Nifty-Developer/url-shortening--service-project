import express from 'express';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import rateLimit from 'express-rate-limit';
import urlRoutes from './routes/urlRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rate Limiting Middleware for /api/shorten route
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many requests, please try again after a minute.'
});

// Apply the rate limiter only to the /api/shorten endpoint
app.use('/api/shorten', limiter);

// Register URL routes with '/api' prefix
app.use('/api', urlRoutes);

// SQLite Database Connection
async function initDatabase() {
    const db = await open({
        filename: process.env.DB_PATH || './database.sqlite',
        driver: sqlite3.Database
    });

    console.log('SQLite database connected...');

    // Create or update the schema to include accessCount and expiresAt columns
    await db.exec(`
        CREATE TABLE IF NOT EXISTS urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            originalUrl TEXT,
            shortUrl TEXT,
            shortId TEXT UNIQUE,
            accessCount INTEGER DEFAULT 0,
            expiresAt TEXT
        );
    `);

    return db;
}

// Initialize the database and start the server
initDatabase().then((db) => {
    app.locals.db = db; // Attach the database connection to the app for easy access in routes
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to the database:', err);
});

