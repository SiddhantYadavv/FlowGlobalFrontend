import { useEffect } from "react";
import { AppState } from "react-native";

import { syncPendingCheckIns } from "../services/syncManager";

export default function useAppSync() {
    useEffect(() => {
        const subscription = AppState.addEventListener(
            "change",
            async (state) => {
                if (state === "active") {
                    await syncPendingCheckIns();
                }
            }
        );

        return () => {
            subscription.remove();
        };
    }, []);
}