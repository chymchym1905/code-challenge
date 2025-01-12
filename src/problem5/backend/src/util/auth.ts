import config from 'config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import moment from 'moment';
import { User, UserUtil } from '../db/user';
import httpError from 'http-errors';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import UserService from '../services/user';

const scrypt = promisify(_scrypt);

/**
 * Creates a token to authenticate the user as user or admin
 * @param {Document<UserAttributes>} user - User to create auth token for
 */
async function createAuthToken(user: User): Promise<string> {
    const expiryConfig: string = config.get('auth.expiry');

    const expiry = moment().add(expiryConfig);
    const { password, ...userWithoutPassword } = UserUtil.toJSON(user);

    const token = jwt.sign(
        {
            iss: user.id,
            user: userWithoutPassword,
            exp: expiry.valueOf()
        },
        config.get('auth.secret')
    );

    return token;
}

/**
 *
 * @param token
 * @returns
 */
function verifyAuthToken(token: string): string {
    const result = jwt.verify(token, config.get('auth.secret')) as JwtPayload;

    if (result.exp && result.exp * 1000 < Date.now()) {
        const error = httpError(401, 'Token has expired');
        throw error;
    }

    return token;
}

/**
 *
 * @param token
 * @returns
 */
function decodeAuthToken(token: string): any {
    return jwt.decode(token, config.get('auth.secret'));
}

/**
 * @description Hashes a password
 * @param {string} password - Password to hash
 * @returns Hashed password
 */
async function hashPassword(password: string): Promise<string> {
    const salt = config.get('auth.secret') as string;
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    return derivedKey.toString('hex');
}

const auth = {
    createAuthToken,
    verifyAuthToken,
    decodeAuthToken,
    hashPassword
};

export default auth;
