import { Router } from 'express';
import { shortenUrl, redirectUrl, getUrlStats } from '../controllers/urlController';

const router = Router();

// Route to shorten a URL
router.post('/shorten', shortenUrl);

// Route to redirect a shortened URL to the original URL
router.get('/:shortUrl', redirectUrl);

// Route to get statistics for a specific shortened URL
router.get('/stats/:shortUrl', getUrlStats);

export default router;
