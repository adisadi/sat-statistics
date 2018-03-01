"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const Database = require('better-sqlite3');
const config = require('./../config.json');
const definitons = __importStar(require("./database/table-definitions"));
function getSingleObject(name) {
    let db = new Database(config.database.file);
    let row = db.prepare('SELECT * FROM ' + definitons.SingleObjectTable.TableName + ' WHERE name=?').get(name);
    return JSON.parse(row.json);
}
exports.getSingleObject = getSingleObject;
function getPersonalStats(currentDate, baseDate, stat) {
    let db = new Database(config.database.file);
    let rows_current = db.prepare('SELECT * FROM ' + definitons.PersonalStatTable.TableName + ' WHERE date=?').all([currentDate]);
    let rows_base;
    if (baseDate) {
        rows_base = db.prepare('SELECT * FROM ' + definitons.PersonalStatTable.TableName + ' WHERE date=?').all([baseDate]);
    }
    return rows_current.map((r) => {
        let obj = JSON.parse(r.json);
        let baseObj = null;
        let baseRow = rows_base.find(b => b.account_id === r.account_id);
        if (baseRow) {
            baseObj = JSON.parse(baseRow.json);
        }
        let returnValue = {
            account_id: r.account_id,
            nickname: obj.nickname,
            current: obj.statistics[stat],
            base: baseObj ? baseObj.statistics[stat] : null,
            updated_at: obj.updated_at
        };
        return returnValue;
    });
}
exports.getPersonalStats = getPersonalStats;
function getPlayerTanksStat(currentDate, baseDate, stat, tank_id) {
    let db = new Database(config.database.file);
    let rows_current = db.prepare('SELECT * FROM ' + definitons.PlayerTankStatTable.TableName + ' WHERE date=? AND tank_id=?').all([currentDate, tank_id]);
    let rows_base;
    if (baseDate) {
        rows_base = db.prepare('SELECT * FROM ' + definitons.PlayerTankStatTable.TableName + ' WHERE date=? AND tank_id=?').all([baseDate, tank_id]);
    }
    return rows_current.map((r) => {
        let obj = JSON.parse(r.json);
        let baseObj = null;
        let baseRow = rows_base.find(b => b.account_id === r.account_id && b.tank_id === r.tank_id);
        if (baseRow) {
            baseObj = JSON.parse(baseRow.json);
        }
        let returnValue = {
            account_id: r.account_id,
            tank_id: r.tank_id,
            current: obj[stat],
            base: baseObj ? baseObj[stat] : null
        };
        return returnValue;
    });
}
exports.getPlayerTanksStat = getPlayerTanksStat;
//# sourceMappingURL=wot-get.js.map