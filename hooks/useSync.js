import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { syncPendingCheckIns } from "../services/syncManager";

export default function useSync() {
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            if (state.isConnected) {
                syncPendingCheckIns();
            }
        });

        return unsubscribe;
    }, []);
}