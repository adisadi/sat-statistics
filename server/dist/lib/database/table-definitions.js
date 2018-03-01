"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalStatTable = {
    TableName: "PersonalStat",
    Fields: [
        { Name: "account_id", Type: "INTEGER" },
        { Name: "date", Type: "INTEGER" },
        { Name: "json", Type: "TEXT" }
    ],
    UniqueKeys: [{ Name: "I_UQ_PERSONALSTATS", Fields: ["account_id", "date"] }],
    EmptyTable: false
};
exports.PlayerTankStatTable = {
    TableName: "PlayerTankStat",
    Fields: [
        { Name: "account_id", Type: "INTEGER" },
        { Name: "tank_id", Type: "INTEGER" },
        { Name: "date", Type: "INTEGER" },
        { Name: "json", Type: "TEXT" }
    ],
    UniqueKeys: [{ Name: "I_UQ_PLAYERTANKSTATS", Fields: ["account_id", "date"] }],
    EmptyTable: false
};
exports.SingleObjectTable = {
    TableName: "SingleObject",
    Fields: [
        { Name: "name", Type: "TEXT" },
        { Name: "json", Type: "INTEGER" }
    ],
    UniqueKeys: [{ Name: "I_UQ_SINGLEOBJECTS", Fields: ["name"] }],
    EmptyTable: true
};
//# sourceMappingURL=table-definitions.js.map