const Database = require('better-sqlite3');

import * as defintions from "./table-definitions";

function genericCreateTableAndInserts(db: any, def: defintions.ITableDefinition, objs:any[]) {

    let rowCount = 0;

    db.prepare("CREATE TABLE IF NOT EXISTS " + def.TableName + " (" + def.Fields.map(c => { return c.Name + " " + c.Type; }).join(",") + ")").run();

    if (def.UniqueKeys) {
        for (let uq of def.UniqueKeys) {
            db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS " + uq.Name + " ON " + def.TableName + " (" + uq.Fields.join(",") + ")").run();
        }
    }

    db.prepare("BEGIN").run();

    if (def.EmptyTable){
        db.prepare("DELETE FROM " + def.TableName).run();   
    }

    let stmt = db.prepare("INSERT OR REPLACE INTO " + def.TableName + " VALUES (" + def.Fields.map(c => { return "?"; }).join(",") + ")");

    for (let o of objs){

        let array = def.Fields.map(c => {
            return o[c.Name];
        });

        stmt.run(array);
        rowCount++;
    }

    db.prepare("COMMIT").run();
  
}


function createSingleObjectsTable(db:any,objs:any[]){
    genericCreateTableAndInserts(db, defintions.SingleObjectTable,objs);
}

function createPersonalStatsTable(db:any,objs:any[]){
    genericCreateTableAndInserts(db, defintions.PersonalStatTable,objs);
}

function createPlayerTanksStatsTable(db:any,objs:any[]){
    genericCreateTableAndInserts(db, defintions.PlayerTankStatTable,objs);
}

export function generate(database: string, singleObjects:any[],  personalStats:any[],playerTanksStats:any[]) {
    let db = new Database(database);
    createSingleObjectsTable(db,singleObjects);
    createPersonalStatsTable(db,personalStats);
    createPlayerTanksStatsTable(db,playerTanksStats);
    db.close();
}

