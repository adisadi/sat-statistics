
const config = require('./../config.json');

const WorldOfTanks = require('wargamer').WorldOfTanks;
const Wargaming = require('wargamer').Wargaming;

const redis = require('./redis');

const WOTClanId = config.wot.clan;
const WOTLanguage = config.wot.language;

const moment = require('moment');

const wot = new WorldOfTanks({ realm: 'eu', applicationId: config.wot.applicationId });
const wg = new Wargaming({ realm: 'eu', applicationId: config.wot.applicationId });


async function getClanId() {
    //Get Clan Id
    var response = await wg.get('clans/list', { search: WOTClanId, game: 'wot' });
    return response.data[0].clan_id;
};

async function getClanRatings(clan_id) {
    var response = await wot.get('clanratings/clans', { clan_id: clan_id, language: WOTLanguage });
    return response.data[clan_id];
}

 async function getClanInfos(clanId) {
    //Get MembersId
    var response = await wg.get('clans/info', { clan_id: clanId, game: 'wot', language: WOTLanguage });
    return response.data[clanId];
};


async function getPlayerPersonalData(ids) {
    var response = await wot.get('account/info', {
        account_id: ids.toString(), language: WOTLanguage,
        extra: "statistics.random,statistics.ranked_battles,statistics.ranked_battles_current,statistics.ranked_battles_previous,statistics.epic",
        fields: "-statistics.clan,-statistics.historical"
    });
    return response.data;
}

async function getTanksData() {
    var response = await wot.get('encyclopedia/tanks', { language: WOTLanguage });
    return response.data;
}

async function getPlayerTanksData(id) {
    var response = await wot.get('tanks/stats', {
        account_id: id, language: WOTLanguage,
        extra: "random,epic,ranked",
        fields: "-clan,-company"
    });
    return response.data;
}

async function importData() {

    var currentDate = new Date();
    await redis.setAsync("execution_time", currentDate);
    return new Promise(async function (resolve, reject) {

        try {
            //Clan Id
            let clanId = await getClanId();
            //Clan Infos
            let info = await getClanInfos(clanId);
            await redis.setAsync("clan", JSON.stringify(info));

            //ClanRatings
            let clanRatings = await getClanRatings(clanId);
            await redis.setAsync("clan-rating", JSON.stringify(clanRatings));

            //Player Personal Data
            let stats = await getPlayerPersonalData(info.members.map((e) => e.account_id));
            await redis.saddAsync("dates", getCurrentDateWithoutTime(currentDate).toISOString());

            let first = true;

            for (let stat in stats) {
                await redis.hmsetAsync("member:" + stats[stat].account_id, "data:" + getCurrentDateWithoutTime(currentDate).toISOString(), JSON.stringify(stats[stat]));

                if (first === true) {
                    if (stats[stat].statistics) {
                        for (let s in stats[stat].statistics) {
                            if (stats[stat].statistics[s])
                                await redis.saddAsync("stats", s);
                        }
                    }
                    first = false;
                }
            }

            //Tanks Data
            let tanksData = await getTanksData();
            redis.setAsync("tanks", JSON.stringify(Object.entries(tanksData).map(([, v]) => v)));
  
            let end = new Date() - currentDate;
            console.log("Execution time: %dms", end);

            resolve({ updateDate: currentDate, duration: end });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

function getCurrentDateWithoutTime(d) {
    var date = moment(d);
    date.startOf('day');
    return date.toDate();
}

module.exports = { importData };










