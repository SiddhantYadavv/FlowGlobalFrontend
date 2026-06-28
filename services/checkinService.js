import db from "../database/database";

export async function saveCheckIn(checkIn) {
    await db.runAsync(
        `INSERT INTO checkins
    (photo, latitude, longitude, notes, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)`,
        [
            checkIn.photo,
            checkIn.latitude,
            checkIn.longitude,
            checkIn.notes,
            "Pending",
            new Date().toISOString(),
        ]
    );
}

export async function getAllCheckIns() {
    return await db.getAllAsync(
        "SELECT * FROM checkins ORDER BY id DESC"
    );
}

export async function getPendingCheckIns() {
    return await db.getAllAsync(
        `
    SELECT *
    FROM checkins
    WHERE status = ?
    ORDER BY id ASC
`,
        ["Pending"]
    );
}

export async function updateStatus(id, status) {
    await db.runAsync(
        `
    UPDATE checkins
    SET status = ?
    WHERE id = ?
`,
        [status, id]
    );
}

export async function markPending(id) {
    await db.runAsync(
        `UPDATE checkins SET status = ? WHERE id = ?`,
        ["Pending", id]
    );
}

export async function deleteCheckIn(id) {
    await db.runAsync(
        `DELETE FROM checkins WHERE id = ?`,
        [id]
    );
}