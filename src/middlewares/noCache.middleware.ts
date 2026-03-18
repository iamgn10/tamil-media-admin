import { Request, Response, NextFunction } from 'express';

export const noCache = (req: Request, res: Response, next: NextFunction) => {
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': false
    });
    next();
};
