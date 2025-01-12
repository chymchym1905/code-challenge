import * as dotenv from 'dotenv';

dotenv.config();

import setupSocket from './real-time-features/socket';
import config from 'config';
import errorHandler from 'errorhandler';
import app from './app';
import { Socket } from 'socket.io/dist';

if (config.get('env.development')) {
    app.use(errorHandler());
}

const server = app.listen(app.get('port'), async () => {
    console.log(`Server listening on port ${app.get('port')}`);
});

const io = setupSocket(server);

export const leaderboardNamespace = io.of('/leaderboard');

leaderboardNamespace.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

process.on('exit', console.log);
export default io;
