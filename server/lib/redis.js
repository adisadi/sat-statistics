const redis = require('redis');
const config = require('../config.json');

let rclient = redis.createClient(config.redis.port, config.redis.server, {no_ready_check: true});

rclient.on("error", function (err) {
    console.log("Redis Error: " + err);
});

rclient.auth(config.redis.pass, function (err) {
    if (err) throw err;
});

rclient.on('connect', function() {
    console.log('Connected to Redis');
});

module.exports={rclient};
