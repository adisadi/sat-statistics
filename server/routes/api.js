const express = require('express');
const router = express.Router();

const async = require('async');

const redis = require('../lib/redis');

const helper = require('../lib/wot');

const winston = require('../lib/logger').winston;

const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(e => {
                winston.error('/' + req.url, e);
                res.status(404).send("Oh uh, something went wrong");
                //next(e);
            });
    };


router.get('/clan', asyncMiddleware(async (req, res, next) => {
    let clanInfo = await redis.getAsync("clan");
    res.json(JSON.parse(clanInfo));
}));

router.get('/tanks', asyncMiddleware(async (req, res, next) => {
    let tanksData = await redis.getAsync("tanks")
    res.json(JSON.parse(tanksData));
}));

router.get('/dates', asyncMiddleware(async (req, res, next) => {
    let dates = await redis.smembersAsync("dates")
    res.json(dates);
}));

router.get('/stats', asyncMiddleware(async (req, res, next) => {
    let stats = await redis.smembersAsync("stats")
    res.json(stats);
}));


router.get('/clan-rating', asyncMiddleware(async (req, res, next) => {
    let stats = await redis.getAsync("clan-rating");
    console.log(stats);
    res.json(JSON.parse(stats));
}));

router.get('/skirmish', asyncMiddleware(async (req, res, next) => {
    let date = req.query.date;
    let baseDate = req.query.basedate;

    let memberKeys = await redis.keysAsync("member*");

    let stats = [];

    for (let key of memberKeys) {

        let currentStats = await redis.hgetAsync(key, "data:" + date);

        let returnValue = { current: JSON.parse(currentStats), base: null };

        if (baseDate && baseDate.length > 0) {
            let baseStats = await redis.hgetAsync(key, "data:" + baseDate);
            returnValue.base = JSON.parse(baseStats);

        }

        if (returnValue.current.statistics.stronghold_skirmish && returnValue.current.statistics.stronghold_skirmish.battles > 0) {
            stats.push({
                account_id: returnValue.current.account_id,
                nickname: returnValue.current.nickname,
                current: returnValue.current.statistics.stronghold_skirmish,
                base: returnValue.base ? returnValue.base.statistics.stronghold_skirmish : null,
                updated_at: returnValue.current.updated_at
            });
        }
    }

    res.json(stats);
}));



router.get('/tree-cut', asyncMiddleware(async (req, res, next) => {
    var stats = [];

    let dates = await redis.smembersAsync("dates");

    //get max date
    let date = new Date(Math.max.apply(null, dates.map(function (e) {
        return new Date(e);
    })));

    let keys = await redis.keysAsync("member*");

    for (let key of keys) {
        let reply = await redis.hgetAsync(key, "data:" + date.toISOString())
        let obj = JSON.parse(reply);
        stats.push({
            account_id: obj.account_id,
            nickname: obj.nickname,
            battles: obj.statistics.all.battles,
            trees_cut: obj.statistics.trees_cut,
            updated_at: obj.updated_at
        });
    }

    winston.info('/tree-cut', stats);
    res.json(stats);

}));


router.get('/updateStats/:force?', asyncMiddleware(async (req, res, next) => {
    var force = req.params.force;

    let executionDate = new Date(await redis.getAsync("execution_time"));

    if (executionDate.getDate() != new Date().getDate() || (force === 'true')) {
        try {
            let r = await helper.importData();

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
}));

module.exports = router;