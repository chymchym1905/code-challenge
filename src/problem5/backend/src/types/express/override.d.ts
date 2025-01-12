import { User } from '../../db/user';
import { LeaderboardEntry, SortedSet } from '../../db/leaderboard';

declare global {
    namespace Express {
        interface Request {
            authToken: string;
            currentUser: User;
            user: User;
            score: number;
            leaderboard: SortedSet;
            leaderboardEntry: LeaderboardEntry;
        }
    }
}
