import { stat } from 'fs';
import { generate } from './database/database';

const config = require('./../config.json');

const WOTClanId = config.wot.clan;
const WOTLanguage = config.wot.language;

const WorldOfTanks = require('wargamer').WorldOfTanks;
const Wargaming = require('wargamer').Wargaming;

const moment = require('moment');

const wot = new WorldOfTanks({ realm: config.wot.realm, applicationId: config.wot.applicationId });
const wg = new Wargaming({ realm: config.wot.realm, applicationId: config.wot.applicationId });


async function getClanId() {
    //Get Clan Id
    var response = await wg.get('clans/list', { search: WOTClanId, game: 'wot' });
    return response.data[0].clan_id;
};

async function getClanRatings(clan_id: number): Promise<any> {
    var response = await wot.get('clanratings/clans', { clan_id: clan_id, language: WOTLanguage });
    return response.data[clan_id];
}

async function getClanInfos(clan_id: number): Promise<any> {
    //Get MembersId
    var response = await wg.get('clans/info', { clan_id: clan_id, game: 'wot', language: WOTLanguage });
    return response.data[clan_id];
};


async function getPlayerPersonalData(ids: number[]): Promise<any> {
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

async function getPlayerTanksData(id: number) {
    var response = await wot.get('tanks/stats', {
        account_id: id, language: WOTLanguage,
        extra: "random,epic,ranked",
        fields: "-clan,-company"
    });
    return response.data[id];
}

export async function importData(): Promise<{ updateDate: Date, duration: number }> {

    let currentDate = new Date();
    let currentDateWithoutTime = getCurrentDateWithoutTime(currentDate);

    let singleObjects: any[] = [{ name: "execution-time", json: JSON.stringify(currentDate) }];

    //Clan Id
    let clanId = await getClanId();

    //Clan Infos
    let info = await getClanInfos(clanId);
    singleObjects.push({ name: "clan-info", json: JSON.stringify(info) });

    //ClanRatings
    let clanRatings = await getClanRatings(clanId);
    singleObjects.push({ name: "clan-rating", json: JSON.stringify(clanRatings) });

    //Tanks
    let tanksData = await getTanksData();
    singleObjects.push({ name: "tanks", json: JSON.stringify(tanksData) });

    //Player Personal Data
    let stats = await getPlayerPersonalData(info.members.map((e: any) => e.account_id));

    let personalStats: any[] = Object.keys(stats).map((key: string) => <any>stats[key] ).map((s: any) => {
        return {
            account_id: s.account_id,
            date: +currentDateWithoutTime,
            json: JSON.stringify(s)
        }
    });

    // Player Tanks Data
    let playerTanksStats = []
    for (let m of info.members) {
        let playerTanks = await getPlayerTanksData(m.account_id);
        for (let t of playerTanks) {
            playerTanksStats.push({
                account_id: m.account_id,
                date: +currentDateWithoutTime,
                tank_id: t.tank_id,
                json: JSON.stringify(t)
            });
        }
    }

    generate(config.database.file, singleObjects, personalStats, playerTanksStats);

    let end = +new Date() - +currentDate;
    console.log("Execution time: %dms", end);

    return { updateDate: currentDate, duration: end };


}

function getCurrentDateWithoutTime(d: any) {
    var date = moment(d);
    date.startOf('day');
    return date.toDate();
}











