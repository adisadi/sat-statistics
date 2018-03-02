const Database = require('better-sqlite3');
const config = require('./../config.json');

import * as definitons from "./database/table-definitions"

export type SingleObjectNames = "execution-time" | "clan-info" | "clan-rating" | "tanks";

export function getSingleObject(name: SingleObjectNames): any {
    let db = new Database(config.database.file);
    let row = db.prepare('SELECT * FROM ' + definitons.SingleObjectTable.TableName + ' WHERE name=?').get(name);
    db.close();
    return JSON.parse(row.json);
}

export function getStatDates(): number[] {
    let db = new Database(config.database.file);
    let rows = db.prepare('SELECT DISTINCT date FROM ' + definitons.PersonalStatTable.TableName + ' ORDER BY date').all();
    db.close();
    return rows.map((d: any) => d.date);
}

export function getPersonalStats(currentDate: Date, baseDate: Date | null, stat: string) {
    let db = new Database(config.database.file);
    let rows_current = db.prepare('SELECT * FROM ' + definitons.PersonalStatTable.TableName + ' WHERE date=?').all([+currentDate]);
    let rows_base: any[];
    if (baseDate) {
        rows_base = db.prepare('SELECT * FROM ' + definitons.PersonalStatTable.TableName + ' WHERE date=?').all([+baseDate]);
    }

    db.close();

    return rows_current.map((r: any) => {
        let obj = JSON.parse(r.json);
        let baseObj = null;
        let baseRow = rows_base ? rows_base.find(b => b.account_id === r.account_id) : undefined;

        if (baseRow) {
            baseObj = JSON.parse(baseRow.json);
        }

        let returnValue: { [k: string]: any } =
            {
                account_id: r.account_id,
                nickname: obj.nickname,
                last_battle_time:obj.last_battle_time,
                global_rating:obj.global_rating,
                current: obj.statistics[stat],
                base: baseObj ? baseObj.statistics[stat] : null,
                updated_at: obj.updated_at
            };

        if (stat === 'trees_cut') {
            returnValue.battles = obj.statistics.all.battles as number;
        }
        return returnValue;
    });
}

export function getPlayerTanksStat(currentDate: Date, baseDate: Date, stat: string, tank_id: number) {
    let db = new Database(config.database.file);
    let rows_current = db.prepare('SELECT * FROM ' + definitons.PlayerTankStatTable.TableName + ' WHERE date=? AND tank_id=?').all([currentDate, tank_id]);
    let rows_base: any[];
    if (baseDate) {
        rows_base = db.prepare('SELECT * FROM ' + definitons.PlayerTankStatTable.TableName + ' WHERE date=? AND tank_id=?').all([baseDate, tank_id]);
    }

    db.close();

    return rows_current.map((r: any) => {
        let obj = JSON.parse(r.json);
        let baseObj = null;
        let baseRow = rows_base.find(b => b.account_id === r.account_id && b.tank_id === r.tank_id);

        if (baseRow) {
            baseObj = JSON.parse(baseRow.json);
        }

        let returnValue =
            {
                account_id: r.account_id,
                tank_id: r.tank_id,
                current: obj[stat],
                base: baseObj ? baseObj[stat] : null
            };
        return returnValue;
    });
}


