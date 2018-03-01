"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database/database");
const config = require('./../config.json');
const WOTClanId = config.wot.clan;
const WOTLanguage = config.wot.language;
const WorldOfTanks = require('wargamer').WorldOfTanks;
const Wargaming = require('wargamer').Wargaming;
const moment = require('moment');
const wot = new WorldOfTanks({ realm: config.wot.realm, applicationId: config.wot.applicationId });
const wg = new Wargaming({ realm: config.wot.realm, applicationId: config.wot.applicationId });
function getClanId() {
    return __awaiter(this, void 0, void 0, function* () {
        //Get Clan Id
        var response = yield wg.get('clans/list', { search: WOTClanId, game: 'wot' });
        return response.data[0].clan_id;
    });
}
;
function getClanRatings(clan_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var response = yield wot.get('clanratings/clans', { clan_id: clan_id, language: WOTLanguage });
        return response.data[clan_id];
    });
}
function getClanInfos(clan_id) {
    return __awaiter(this, void 0, void 0, function* () {
        //Get MembersId
        var response = yield wg.get('clans/info', { clan_id: clan_id, game: 'wot', language: WOTLanguage });
        return response.data[clan_id];
    });
}
;
function getPlayerPersonalData(ids) {
    return __awaiter(this, void 0, void 0, function* () {
        var response = yield wot.get('account/info', {
            account_id: ids.toString(), language: WOTLanguage,
            extra: "statistics.random,statistics.ranked_battles,statistics.ranked_battles_current,statistics.ranked_battles_previous,statistics.epic",
            fields: "-statistics.clan,-statistics.historical"
        });
        return response.data;
    });
}
function getTanksData() {
    return __awaiter(this, void 0, void 0, function* () {
        var response = yield wot.get('encyclopedia/tanks', { language: WOTLanguage });
        return response.data;
    });
}
function getPlayerTanksData(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var response = yield wot.get('tanks/stats', {
            account_id: id, language: WOTLanguage,
            extra: "random,epic,ranked",
            fields: "-clan,-company"
        });
        return response.data[id];
    });
}
function importData() {
    return __awaiter(this, void 0, void 0, function* () {
        let currentDate = new Date();
        let currentDateWithoutTime = getCurrentDateWithoutTime(currentDate);
        let singleObjects = [{ name: "execution-time", json: JSON.stringify(currentDate) }];
        //Clan Id
        let clanId = yield getClanId();
        //Clan Infos
        let info = yield getClanInfos(clanId);
        singleObjects.push({ name: "clan-info", json: JSON.stringify(info) });
        //ClanRatings
        let clanRatings = yield getClanRatings(clanId);
        singleObjects.push({ name: "clan-rating", json: JSON.stringify(clanRatings) });
        //Tanks
        let tanksData = yield getTanksData();
        singleObjects.push({ name: "tanks", json: JSON.stringify(tanksData) });
        //Player Personal Data
        let stats = yield getPlayerPersonalData(info.members.map((e) => e.account_id));
        let personalStats = Object.keys(stats).map((key) => stats[key]).map((s) => {
            return {
                account_id: s.account_id,
                date: +currentDateWithoutTime,
                json: JSON.stringify(s)
            };
        });
        // Player Tanks Data
        let playerTanksStats = [];
        for (let m of info.members) {
            let playerTanks = yield getPlayerTanksData(m.account_id);
            for (let t of playerTanks) {
                playerTanksStats.push({
                    account_id: m.account_id,
                    date: +currentDateWithoutTime,
                    tank_id: t.tank_id,
                    json: JSON.stringify(t)
                });
            }
        }
        database_1.generate(config.database.file, singleObjects, personalStats, playerTanksStats);
        let end = +new Date() - +currentDate;
        console.log("Execution time: %dms", end);
        return { updateDate: currentDate, duration: end };
    });
}
exports.importData = importData;
function getCurrentDateWithoutTime(d) {
    var date = moment(d);
    date.startOf('day');
    return date.toDate();
}
//# sourceMappingURL=wot-import.js.map