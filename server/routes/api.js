const express = require('express');
const router = express.Router();

const async = require('async');

const rclient = require('../lib/redis').rclient;
const redis = require('../lib/redis');

const helper = require('../lib/wot');

const winston = require('../lib/logger').winston;


router.get('/clan', (req, res) => {
    redis.getAsync("clan")
        .then(obj => res.json(JSON.parse(obj)));
});

router.get('/tanks', (req, res) => {
    redis.getAsync("tanks")
        .then(obj => res.json(JSON.parse(obj)));
});

router.get('/dates', (req, res) => {
    redis.smembersAsync("dates")
        .then(dates => res.json(dates));
});

router.get('/stats', (req, res) => {
    redis.smembersAsync("stats")
        .then(dates => res.json(dates));
});

router.get('/skirmish', (req, res) => {
    let date = req.query.date;
    let baseDate = req.query.basedate;

    redis.keysAsync("member*")
        .then((keys) => {
            let stats = [];
            let promises = [];
            for (let key of keys) {
                promises.push(
                    redis.hgetAsync(key, "data:" + date)
                        .then((obj) => {
                            let returnValue = { current: JSON.parse(obj), base: null }
                            if (baseDate && baseDate.length > 0) {
                                return redis.hgetAsync(key, "data:" + baseDate)
                                    .then((baseObj) => {
                                        returnValue.base = JSON.parse(baseObj);
                                        return returnValue;
                                    });
                            } else {
                                return returnValue;
                            }
                        })
                        .then((obj) => {
                            if (obj.current.statistics.stronghold_skirmish && obj.current.statistics.stronghold_skirmish.battles > 0) {
                                stats.push({
                                    account_id: obj.current.account_id,
                                    nickname: obj.current.nickname,
                                    current: obj.current.statistics.stronghold_skirmish,
                                    base: obj.base ? obj.base.statistics.stronghold_skirmish : null,
                                    updated_at: obj.current.updated_at
                                });
                            }
                        })
                );
            }

            return Promise.all(promises).then(() => { return stats; });

        })
        .then((stats) => {
            winston.info('/skirmish', stats);
            res.json(stats);
        })
        .catch(error => {
            winston.error('/skirmish', error);
            res.status(404).send("Oh uh, something went wrong");
        });
});



router.get('/tree-cut', (req, res) => {
    var stats = [];
    rclient.smembers("dates", (err, dates) => {
        //get max date
        let date = new Date(Math.max.apply(null, dates.map(function (e) {
            return new Date(e);
        })));

        rclient.keys("member*", (err, keys) => {
            async.each(keys,
                function (key, callback) {
                    rclient.hget(key, "data:" + date.toISOString(), (err, reply) => {
                        let obj = JSON.parse(reply);
                        stats.push({
                            account_id: obj.account_id,
                            nickname: obj.nickname,
                            battles: obj.statistics.all.battles,
                            trees_cut: obj.statistics.trees_cut,
                            updated_at: obj.updated_at
                        });
                        callback();
                    });
                },
                function () {
                    winston.info('/tree-cut', stats);
                    res.json(stats);
                }
            );
        });

    });
});


router.get('/memberStats/:id', (req, res) => {
    var stats = [];
    var id = req.params.id;
    rclient.hkeys("member:" + id, function (e, keys) {
        async.each(keys,
            function (key, callback) {
                rclient.hget("member:" + id, key, (err, reply) => {
                    stats.push({ date: new Date(key.replace("data:", "")), obj: JSON.parse(reply) });
                    callback();
                });
            },
            function () {
                winston.info('/memberStats/' + id, stats);
                res.json(stats);
            }
        );
    });
});

router.get('/updateStats/:force?', (req, res) => {
    var force = req.params.force;
    rclient.get("execution_time", function (err, date) {
        var date = new Date(date);
        if (date.getDate() != new Date().getDate() || (force === 'true')) {
            helper.importData()
                .then((r) => {
                    winston.info('/updateStats', { status: 'UPDATED', lastUpdate: r.updateDate, executionTime: r.duration });
                    res.json({ status: 'UPDATED', lastUpdate: r.updateDate, executionTime: r.duration });
                })
                .catch((err) => {
                    winston.error('/updateStats', err);
                    res.json({ status: 'ERROR', error: err.toString() });
                });
        }
        else {
            winston.info('/updateStats', { status: 'NOTUPDATED', lastUpdate: date });
            res.json({ status: 'NOTUPDATED', lastUpdate: date });
        }
    });
});

module.exports = router;