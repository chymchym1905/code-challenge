import express from 'express';
import { NextFunction, Request, Response } from 'express';
import LeaderboardServices from '../services/leaderboard';

const router = express.Router();

router.get('/get/:id', getLeaderboard);
router.get('/get-details/:id', getLeaderboardWithDetails);
router.post('/createscore', createScore);
router.put('/updatescore', createScore);
router.delete('/removescore', removeScore);

async function getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        let { start, end, dir } = req.query;
        if (!start) start = '0';
        if (!end) end = '-1';
        const leaderboard = await LeaderboardServices.getLeaderboard(
            parseInt(id as string),
            parseInt(start as string),
            parseInt(end as string),
            dir as string
        );
        res.status(200);
        res.json(leaderboard);
    } catch (error: Error | any) {
        res.status(500);
        console.log(error);
        res.json({ Error: error.message });
    }
}

/**
 * @api {get} /leaderboard/get-details/:id Get leaderboard with user details
 * @apiName GetLeaderboardWithDetails
 * @apiGroup Leaderboard
 * @apiParam {Number} id leaderboard id
 * @apiParam {Number} [start=0] start rank
 * @apiParam {Number} [end=-1] end rank
 * @apiSuccess {Object[]} leaderboard leaderboard with user details
 */
async function getLeaderboardWithDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        let { start, end, dir } = req.query;
        if (!start) start = '0';
        if (!end) end = '-1';
        const leaderboard = await LeaderboardServices.getLeaderboardWithDetails(
            parseInt(id as string),
            parseInt(start as string),
            parseInt(end as string),
            dir as string
        );
        res.status(200);
        res.json(leaderboard);
    } catch (error: Error | any) {
        res.status(500);
        console.log(error);
        res.json({ Error: error.message });
    }
}

async function createScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { leaderboardId, score } = req.body;
        const { id } = req.currentUser;
        const leaderboard = await LeaderboardServices.createScore(leaderboardId, score, id);
        res.status(200);
        res.json(leaderboard);
    } catch (error: Error | any) {
        res.status(500);
        console.log(error);
        res.json({ Error: error.message });
    }
}

async function removeScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { leaderboardId } = req.body;
        const { name } = req.currentUser;
        const retCode = await LeaderboardServices.removeScore(leaderboardId, name);
        res.status(200);
        res.send(`${retCode} entry(ies) removed`);
    } catch (error: Error | any) {
        res.status(500);
        res.json({ Error: error.message });
    }
}

export default router;
