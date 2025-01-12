import { LeaderboardEntry, LeaderboardEntryAll, SortedSet } from '../db/leaderboard';
import redisClient from '../../config/redisclient';
import async, { AsyncResultCallback } from 'async';
import { leaderboardNamespace } from '../server';

function parseRedisZrange(res: any[]): { [key: string]: any } {
    return res.reduce((acc, value, index, array) => {
        if (index % 2 === 0) {
            const name = value;
            const score = parseFloat(array[index + 1]);
            acc.push({ name, score });
        }
        return acc;
    }, []);
}

async function getLeaderboard(id: number, start: number, end: number, dir: string): Promise<SortedSet> {
    const key = `leaderboard:${id}`;
    const rawLB =
        dir === 'desc'
            ? await redisClient.zrevrange(key, start, end, 'WITHSCORES')
            : await redisClient.zrange(key, start, end, 'WITHSCORES');
    const leaderboard = parseRedisZrange(rawLB);
    const entries = leaderboard.map((entry: { [key: string]: any }) => {
        return LeaderboardEntry.fromData(id, entry.name, entry.score);
    });
    const sortedSet = SortedSet.fromData(key, entries);
    return sortedSet;
}

async function getLeaderboardWithDetails(id: number, start: number, end: number, dir: string): Promise<SortedSet> {
    const key = `leaderboard:${id}`;
    const rawLB =
        dir === 'desc'
            ? await redisClient.zrevrange(key, start, end, 'WITHSCORES')
            : await redisClient.zrange(key, start, end, 'WITHSCORES');
    const leaderboard = parseRedisZrange(rawLB);
    const tasks = leaderboard.map((entry: { [key: string]: any }) => async (next: AsyncResultCallback<any>) => {
        try {
            const userId = entry.name;
            const userInfo = await redisClient.hgetall(`user:${userId}`);
            const { password, ...userInfoWithoutPassword } = userInfo;
            return next(null, LeaderboardEntryAll.fromData(id, userInfoWithoutPassword, entry.score));
        } catch (error: any) {
            return next(error);
        }
    });
    const entries: LeaderboardEntryAll[] = await async.parallelLimit(tasks, 10);
    return SortedSet.fromData(key, entries);
}

async function createScore(id: number, score: number, userId?: string): Promise<LeaderboardEntry> {
    const key = `leaderboard:${id}`;
    if (!userId) throw new Error('userID is required');
    await redisClient.zadd(key, score, userId);
    const sortedSet = await getLeaderboard(id, 0, 9, 'desc');
    leaderboardNamespace.emit('update', JSON.stringify(sortedSet.entries));
    return LeaderboardEntry.fromData(id, userId, score);
}

async function removeScore(id: number, name: string): Promise<number> {
    const key = `leaderboard:${id}`;
    const retCode = await redisClient.zrem(key, name);
    const sortedSet = await getLeaderboard(id, 0, 9, 'desc');
    leaderboardNamespace.emit('update', JSON.stringify(sortedSet.entries));
    return retCode;
}

const leaderboardService = {
    getLeaderboard,
    getLeaderboardWithDetails,
    createScore,
    removeScore
};

export default leaderboardService;
