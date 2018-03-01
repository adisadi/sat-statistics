import express from 'express';
import winston from '../lib/logger';

import { NextFunction, RequestHandler } from 'express';

const router = express.Router();

import { importData } from '../lib/wot-import';
import { SingleObjectNames, getSingleObject, getPersonalStats, getPlayerTanksStat } from '../lib/wot-get';

router.get('/clan', (req, res, next) => {
    let clanInfo = getSingleObject("clan-info");
    res.json(clanInfo);
});

router.get('/tanks', (req, res, next) => {
    let tanksData = getSingleObject("tanks");
    res.json(tanksData);
});

/* router.get('/dates',  (req, res, next) => {
    let dates = await redis.smembersAsync("dates")
    res.json(dates);
}); */

router.get('/clan-rating', (req, res, next) => {
    let stats = getSingleObject("clan-rating");
    res.json(stats);
});

router.get('/personal-stats', async (req, res, next) => {
    let date = req.query.date;
    let baseDate = req.query.basedate;
    let stat = req.query.basedate;

    if (!stat || date) {
        next(new Error("Invalid Parameters"));
    }

    let stats: any = getPersonalStats(new Date(date), baseDate ? new Date(baseDate) : null, stat);
    res.json(stats);
});

router.get('/updateStats/:force?', async (req, res, next) => {
    var force = req.params.force;

    let executionDate = null;
    try {
        executionDate = getSingleObject("execution-time");
    } catch (error) {

    }

    if (!executionDate || executionDate.getDate() != new Date().getDate() || (force === 'true')) {
        try {
            let r = await importData();

            winston.info('/updateStats', { status: 'UPDATED', lastUpdate: r.updateDate, executionTime: r.duration });
            res.json({ status: 'UPDATED', lastUpdate: r.updateDate, executionTime: r.duration });
        } catch (err) {
            winston.error('/updateStats', err);
            res.json({ status: 'ERROR', error: err.toString() });
        }

    }
    else {
        winston.info('/updateStats', { status: 'NOTUPDATED', lastUpdate: executionDate });
        res.json({ status: 'NOTUPDATED', lastUpdate: executionDate });
    }
});

export = router;