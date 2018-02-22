

const redis = require('redis');
const async = require("async");

const config = require('./../config.json');

const WorldOfTanks = require('wargamer').WorldOfTanks;
const Wargaming = require('wargamer').Wargaming;

const rclient = require('./redis').rclient;

const WOTClanId = config.wot.clan;
const WOTLanguage = config.wot.language;

const moment = require('moment');

var wot = new WorldOfTanks({ realm: 'eu', applicationId: config.wot.applicationId });
var wg = new Wargaming({ realm: 'eu', applicationId: config.wot.applicationId });


var getClanId = function () {
    //Get Clan Id
    return wg.get('clans/list', { search: WOTClanId, game: 'wot' })
        .then((response) => {
            return response.data[0].clan_id;
        });
};

var getClanInfos = function (clanId) {
    //Get MembersId
    return wg.get('clans/info', { clan_id: clanId, game: 'wot', language: WOTLanguage })
        .then((response) => {
            return response.data[clanId];
        });
};


var getPlayerPersonalData = function (ids) {
    return wot.get('account/info', {
        account_id: ids.toString(), language: WOTLanguage,
        extra: "statistics.random,statistics.ranked_battles,statistics.ranked_battles_current,statistics.ranked_battles_previous,statistics.epic",
        fields: "-statistics.clan,-statistics.historical"
    })
        .then((response) => {
            return response.data;
        });
}

var getTanksData = function () {
    return wot.get('encyclopedia/tanks', { language: WOTLanguage })
        .then((response) => {
            return response.data;
        });
}

var getPlayerTanksData = function (id) {
    return wot.get('tanks/stats', {
        account_id: id, language: WOTLanguage,
        extra: "random,epic,ranked",
        fields: "-clan,-company"
    })
        .then((response) => {
            return response.data;
        });
}

function importData() {

    var currentDate = new Date();
    rclient.set("execution_time", currentDate);
    return new Promise(function (resolve, reject) {
        getClanId()
            .then(getClanInfos)
            .then((info) => {
                rclient.set("clan", JSON.stringify(info));
                return info;
            })
            .then((info) => {
                return getPlayerPersonalData(info.members.map((e) => e.account_id));
            })
            .then((stats) => {
                rclient.sadd("dates", getCurrentDateWithoutTime(currentDate).toISOString());
                let first = true;

                for (let stat in stats) {
                    rclient.hmset("member:" + stats[stat].account_id, "data:" + getCurrentDateWithoutTime(currentDate).toISOString(), JSON.stringify(stats[stat]));

                    if (first === true) {
                        if (stats[stat].statistics) {
                            for (let s in stats[stat].statistics) {
                                if (stats[stat].statistics[s])
                                    rclient.sadd("stats", s);
                            }
                        }
                        first = false;
                    }
                }

                return;
            })
            .then(getTanksData)
            .then((tanks) => {
                rclient.set("tanks", JSON.stringify(Object.entries(tanks).map(([, v]) => v)));
                return;
            })
            .then(() => {
                let end = new Date() - currentDate;
                console.log("Execution time: %dms", end);
                resolve({ updateDate: currentDate, duration: end });
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            })
    });
};

function getCurrentDateWithoutTime(d) {
    var date = moment(d);
    date.startOf('day');
    return date.toDate();
}

module.exports = { importData };










