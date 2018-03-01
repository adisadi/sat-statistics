export interface IFieldDefinition {
    Name: string,
    Type: string
}

export interface IUniqueKeyDefinition {
    Name: string,
    Fields: String[]
}

export interface ITableDefinition {
    TableName: string,
    Fields: IFieldDefinition[],
    UniqueKeys: IUniqueKeyDefinition[] | null,
    EmptyTable: boolean
}


export const PersonalStatTable: ITableDefinition = {
    TableName: "PersonalStat",
    Fields: [
        { Name: "account_id", Type: "INTEGER" },
        { Name: "date", Type: "INTEGER" },
        { Name: "json", Type: "TEXT" }
    ],
    UniqueKeys: [{ Name: "I_UQ_PERSONALSTATS", Fields: ["account_id", "date"] }],
    EmptyTable: false
}

export const PlayerTankStatTable: ITableDefinition = {
    TableName: "PlayerTankStat",
    Fields: [
        { Name: "account_id", Type: "INTEGER" },
        { Name: "tank_id", Type: "INTEGER" },
        { Name: "date", Type: "INTEGER" },
        { Name: "json", Type: "TEXT" }
    ],
    UniqueKeys: [{ Name: "I_UQ_PLAYERTANKSTATS", Fields: ["account_id", "date", "tank_id"] }],
    EmptyTable: false
}

export const SingleObjectTable: ITableDefinition = {
    TableName: "SingleObject",
    Fields: [
        { Name: "name", Type: "TEXT" },
        { Name: "json", Type: "INTEGER" }
    ],
    UniqueKeys: [{ Name: "I_UQ_SINGLEOBJECTS", Fields: ["name"] }],
    EmptyTable: true
}










