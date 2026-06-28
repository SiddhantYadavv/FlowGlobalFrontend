import NetInfo from "@react-native-community/netinfo";

import { uploadCheckIn } from "./uploadApi";

import {
    deleteCheckIn,
    getPendingCheckIns,
    updateStatus
} from "./checkinService";

let syncing = false;

export async function syncPendingCheckIns() {
    if (syncing) return;

    syncing = true;

    try {
        const state = await NetInfo.fetch();

        if (!state.isConnected) {
            return;
        }

        const pending = await getPendingCheckIns();

        for (const checkIn of pending) {
            try {
                await uploadSingleCheckIn(checkIn);
            } catch (err) {
                console.log(err);
            }
        }
    } finally {
        syncing = false;
    }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function uploadSingleCheckIn(checkIn) {
    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await updateStatus(checkIn.id, "Uploading");

            const response = await uploadCheckIn(checkIn);

            if (response.success) {
                await deleteCheckIn(checkIn.id);
                return;
            }

            throw new Error("Upload failed");
        } catch (error) {
            if (attempt === MAX_RETRIES) {
                await updateStatus(checkIn.id, "Failed");
                return;
            }

            const waitTime = Math.pow(2, attempt) * 1000;

            console.log(
                `Retry ${attempt} for Check-In ${checkIn.id} in ${waitTime} ms`
            );

            await delay(waitTime);
        }
    }
}

export async function retryCheckIn(checkIn) {
    try {
        await updateStatus(checkIn.id, "Uploading");

        const response = await uploadCheckIn(checkIn);

        if (response.success) {
            await deleteCheckIn(checkIn.id);
            return true;
        }

        throw new Error("Upload failed");
    } catch (error) {
        console.log(error.message);

        await updateStatus(checkIn.id, "Failed");

        return false;
    }
}