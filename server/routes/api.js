const express = require('express');
const router = express.Router();
const redis = require('redis');
const async = require('async');

const rclient = require('../lib/redis').rclient;

const helper = require('../lib/wot');

const winston = require('../lib/logger').winston;


/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works');
});

router.get('/clan', (req, res) => {
    rclient.get("clan", function (err, obj) {
        res.json(JSON.parse(obj));
    });
});

router.get('/tanks', (req, res) => {
    rclient.get("tanks", function (err, obj) {
        res.json(JSON.parse(obj));
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