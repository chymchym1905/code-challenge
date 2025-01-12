import PRIVATE_ROUTE from '../constants/privateroutes';
import Auth from '../util/auth';
import { Request, Response, NextFunction } from 'express';
import httpError from 'http-errors';
import express from 'express';

function isPrivateRoute(baseUrl: string): boolean {
    return !!baseUrl.match(PRIVATE_ROUTE);
}

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
    const token = req.get('authorization');

    if (isPrivateRoute(req.baseUrl) && !token) {
        const error = httpError(401, 'Token is missing');
        return next(error);
    }

    if (!token) return next();

    const decodedToken = Auth.decodeAuthToken(token);

    req.authToken = Auth.verifyAuthToken(token);
    req.currentUser = decodedToken.user;
    req.currentUser.id = decodedToken.iss;

    return next();
}

const router = express.Router();
router.use(verifyToken);

export default router;
