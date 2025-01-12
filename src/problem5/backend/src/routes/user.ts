import express from 'express';
import config from 'config';
import { NextFunction, Request, Response } from 'express';
import httpError from 'http-errors';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import UserServices from '../services/user';
import Auth from '../util/auth';
import { User } from '../db/user';

const scrypt = promisify(_scrypt);
const router = express.Router();

router.post('/login', findUser, validatePassword, createAuthToken, present);
router.post('/register', create);
router.put('/update', updateUser);

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const userData = req.body as User;
        const user = await UserServices.createUser(userData);
        res.status(200);
        res.json({
            user
        });
    } catch (error) {
        return next(error);
    }
}
async function createAuthToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    await Auth.createAuthToken(req.currentUser)
        .then((token: string) => {
            req.authToken = token;
        })
        .catch(next);

    return next();
}

async function findUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.body.userEmail) {
        const error = new Error('No email specified.');

        return next(error);
    }

    await UserServices.getUserByEmail(req.body.userEmail).then((user) => {
        if (user) {
            req.currentUser = user;
            return next();
        }
        const error = httpError(404, 'No user matching specified email found.');

        return next(error);
    });
}

async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        await UserServices.updateUser(req.body.id, req.body.user);
        res.status(200);
        res.send('User updated.');
    } catch (error) {
        res.status(500);
        res.send('Error updating user: ' + error);
    }
}

async function validatePassword(req: Request, res: Response, next: NextFunction) {
    try {
        const salt = config.get('auth.secret') as string;
        const derivedKey = (await scrypt(req.body.password, salt, 64)) as Buffer;
        if (!(derivedKey.toString('hex') === req.currentUser.password)) {
            const error = httpError(401, 'Invalid email or password. Please try again.');
            return next(error);
        }
        return next();
    } catch (error) {
        return next(error);
    }
}

function present(req: Request, res: Response, next: NextFunction) {
    const { password, ...userwithoutPassword } = req.currentUser;
    res.status(200);
    res.json({
        user: userwithoutPassword,
        authToken: req.authToken
    });
}
export default router;
