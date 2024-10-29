import { Request, Response } from 'express';

// Controller to handle URL shortening
export const shortenUrl = (req: Request, res: Response) => {
  res.send('Shortened URL created');
};

// Controller to handle redirection of shortened URLs
export const redirectUrl = (req: Request, res: Response) => {
  res.send('Redirecting to original URL');
};

// Controller to get statistics of a shortened URL
export const getUrlStats = (req: Request, res: Response) => {
  res.send('URL statistics');
};
