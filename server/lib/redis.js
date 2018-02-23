const redis = require('redis');
const config = require('../config.json');

let rclient = redis.createClient(config.redis.port, config.redis.server, { no_ready_check: true });

const { promisify } = require('util');
const setAsync = promisify(rclient.set).bind(rclient)
const getAsync = promisify(rclient.get).bind(rclient);
const hgetAsync = promisify(rclient.hget).bind(rclient);
const smembersAsync = promisify(rclient.smembers).bind(rclient);
const keysAsync = promisify(rclient.keys).bind(rclient);
const saddAsync = promisify(rclient.sadd).bind(rclient);
const hmsetAsync = promisify(rclient.hmset).bind(rclient);


rclient.on("error", function (err) {
    console.log("Redis Error: " + err);
});

rclient.auth(config.redis.pass, function (err) {
    if (err) throw err;
});

rclient.on('connect', function () {
    console.log('Connected to Redis');
});

module.exports = {
    getAsync,
    hgetAsync,
    smembersAsync,
    keysAsync,
    saddAsync,
    setAsync,
    hmsetAsync
};
