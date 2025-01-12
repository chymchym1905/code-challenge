export class LeaderboardEntry {
    constructor(public id: number, public userid: string, public score: number) {}

    static fromData(id: number, userid: string, score: number): LeaderboardEntry {
        return new LeaderboardEntry(id, userid, score);
    }
}

export class LeaderboardEntryAll {
    constructor(public id: number, public userInfo: { [key: string]: any }, public score: number) {}

    static fromData(id: number, userInfo: { [key: string]: any }, score: number): LeaderboardEntryAll {
        return new LeaderboardEntryAll(id, userInfo, score);
    }
}

export class SortedSet {
    constructor(public key: string, public entries: LeaderboardEntry[] | LeaderboardEntryAll[]) {}

    static fromData(key: string, entries: LeaderboardEntry[] | LeaderboardEntryAll[]): SortedSet {
        return new SortedSet(key, entries);
    }
}
