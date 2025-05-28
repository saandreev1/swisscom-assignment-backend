import { Request, Response, NextFunction } from 'express';

export function requireRole(role: 'ADMIN' | 'REVIEWER') {
    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (req.user.role !== role) {
            res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
            return;
        }

        next();
    };
}