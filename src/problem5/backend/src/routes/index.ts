import config from 'config';
import { Express } from 'express';
import redisClient from '../../config/redisclient';
import leaderboard from './leaderboard';
import middleware from './middleware';
import user from './user';
import morgan from 'morgan';
import fs from 'fs';

export default async function routes(app: Express) {
    const logStream = fs.createWriteStream('./access.log', { flags: 'a' });
    app.use(morgan('common', { stream: logStream }));
    app.use('*', middleware);
    app.use('/api/leaderboard', leaderboard);
    app.use('/api/user', user);
    await redisClient.get('user:id').then((id) => {
        if (!id) {
            redisClient.set('user:id', '0');
        }
    });
}
