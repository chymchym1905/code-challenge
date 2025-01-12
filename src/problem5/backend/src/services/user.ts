import { User, UserUtil } from '../db/user';
import Auth from '../util/auth';
import redisClient, { redlock } from '../../config/redisclient';
import { Lock } from 'redlock/dist';

async function getUserById(id: number): Promise<User> {
    const key = `user:${id}`;
    const user = await redisClient.get(key);
    if (user) {
        const userObj = JSON.parse(user) as User;
        return userObj;
    } else {
        throw new Error('User not found');
    }
}

async function getUserByEmail(email: string): Promise<User | void> {
    try {
        const key = `user:byemail:${email}`;
        const userKey = await redisClient.get(key);
        if (userKey) {
            const user = await redisClient.hgetall(`user:${userKey}`);
            const userObj = JSON.stringify(user, null, 2);
            const res = JSON.parse(userObj) as User;
            res.id = userKey;
            return res;
        }
    } catch (error) {
        throw error;
    }
}

async function createUser(user: User): Promise<void> {
    const transaction = redisClient.multi();
    try {
        const checkEmail = await redisClient.get(`user:byemail:${user.email}`);
        if (checkEmail) {
            throw new Error('Email already exists');
        }
        await redlock.using(['lock:user:id'], 60000, async (signal) => {
            let id = await redisClient.get('user:id');
            await transaction.incr('user:id');
            if (signal.aborted) {
                throw signal.error;
            }
            transaction.hset(`user:${parseInt(id!) + 1}`, {
                name: user.name,
                email: user.email,
                rankings: JSON.stringify(user.rankings),
                createdAt: new Date().toISOString(),
                password: await Auth.hashPassword(user.password)
            });
            transaction.set(`user:byemail:${user.email}`, (parseInt(id!) + 1).toString() ?? '-1');
            const results = await transaction.exec();
            console.log(results);
        });
    } catch (error) {
        await transaction.discard();
        throw error;
    }
}

async function updateUser(id: number, user: User): Promise<void> {
    try {
        const results = await redisClient.hset(`user:${id}`, {
            name: user.name,
            email: user.email,
            rankings: JSON.stringify(user.rankings)
        });
        console.log(results);
    } catch (error) {
        throw error;
    }
}

const userService = {
    getUserById,
    getUserByEmail,
    createUser,
    updateUser
};

export default userService;
