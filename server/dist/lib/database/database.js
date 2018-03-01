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
const defintions = __importStar(require("./table-definitions"));
function genericCreateTableAndInserts(db, def, objs) {
    let rowCount = 0;
    db.prepare("CREATE TABLE IF NOT EXISTS " + def.TableName + " (" + def.Fields.map(c => { return c.Name + " " + c.Type; }).join(",") + ")").run();
    if (def.UniqueKeys) {
        for (let uq of def.UniqueKeys) {
            db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS " + uq.Name + " ON " + def.TableName + " (" + uq.Fields.join(",") + ")").run();
        }
    }
    db.prepare("BEGIN").run();
    if (def.EmptyTable) {
        db.prepare("DELETE FROM " + def.TableName).run();
    }
    let stmt = db.prepare("INSERT INTO " + def.TableName + " VALUES (" + def.Fields.map(c => { return "?"; }).join(",") + ")");
    for (let o of objs) {
        let array = def.Fields.map(c => {
            return o[c.Name];
        });
        stmt.run(array);
        rowCount++;
    }
    db.prepare("COMMIT").run();
}
function createSingleObjectsTable(db, objs) {
    genericCreateTableAndInserts(db, defintions.SingleObjectTable, objs);
}
function createPersonalStatsTable(db, objs) {
    genericCreateTableAndInserts(db, defintions.PersonalStatTable, objs);
}
function createPlayerTanksStatsTable(db, objs) {
    genericCreateTableAndInserts(db, defintions.PlayerTankStatTable, objs);
}
function generate(database, singleObjects, personalStats, playerTanksStats) {
    let db = new Database(database);
    createSingleObjectsTable(db, singleObjects);
    createPersonalStatsTable(db, personalStats);
    createPlayerTanksStatsTable(db, playerTanksStats);
}
exports.generate = generate;
//# sourceMappingURL=database.js.map