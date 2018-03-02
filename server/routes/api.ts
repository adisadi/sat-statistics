import express from 'express';
import winston from '../lib/logger';

import { NextFunction, RequestHandler } from 'express';

const router = express.Router();

import { importData } from '../lib/wot-import';
import { SingleObjectNames, getSingleObject, getPersonalStats, getPlayerTanksStat, getStatDates } from '../lib/wot-get';

router.get('/clan', (req, res, next) => {
    let clanInfo = getSingleObject("clan-info");
    res.json(clanInfo);
});

router.get('/update-date', (req, res, next) => {
    let executionTime = getSingleObject("execution-time");
    res.json(+new Date(executionTime));
});



router.get('/tanks', (req, res, next) => {
    let tanksData = getSingleObject("tanks");
    res.json(tanksData);
});

router.get('/dates', (req, res, next) => {
    let dates = getStatDates();
    res.json(dates);
});

router.get('/clan-rating', (req, res, next) => {
    let stats = getSingleObject("clan-rating");
    res.json(stats);
});

router.get('/personal-stats', async (req, res, next) => {
    let date: number = req.query.date;
    let baseDate: number | undefined = req.query.basedate;
    let stat: string = req.query.stat;

    if (!stat) {
        return next(new Error("Invalid Parameters"));
    }

    if (!date) {
        baseDate = undefined;
        date = Math.max.apply(null, getStatDates());
    }

    let stats: any = getPersonalStats(new Date(+date), baseDate ? new Date(+baseDate) : null, stat);
    res.json(stats);
});

router.get('/updateStats/:force?', async (req, res, next) => {
    var force = req.params.force;

    try {
        let executionDate = null;

        try {
            executionDate = new Date(getSingleObject("execution-time"));
        } catch (error) {
            winston.error(error);
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
    } catch (error) {
        next(error);
    }
});

export = router;