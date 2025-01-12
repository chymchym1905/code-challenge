import Redis from 'ioredis';
import Redlock from 'redlock';

const redisClient = new Redis({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: 16113
});

export const redlock = new Redlock([redisClient], {
    driftFactor: 0.01, // Time drift factor (default: 0.01)
    retryCount: 15, // Retry attempts
    retryDelay: 1000, // Retry delay (in ms)
    retryJitter: 200 // Retry jitter (randomized delay)
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.log('Redis error:', err);
});

export default redisClient;
