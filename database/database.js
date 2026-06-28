import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("checkins.db");

db.execAsync(`
CREATE TABLE IF NOT EXISTS checkins(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    photo TEXT,
    latitude REAL,
    longitude REAL,
    notes TEXT,
    status TEXT,
    createdAt TEXT
);
`);

export default db;