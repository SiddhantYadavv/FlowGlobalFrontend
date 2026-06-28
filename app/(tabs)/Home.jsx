import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getAllCheckIns } from "../../services/checkinService";

export default function Home() {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        success: 0,
        failed: 0,
    });

    const loadStats = async () => {
        try {
            const checkIns = await getAllCheckIns();

            const total = checkIns.length;

            const pending = checkIns.filter(
                (item) => item.status === "Pending"
            ).length;

            const success = checkIns.filter(
                (item) => item.status === "Success"
            ).length;

            const failed = checkIns.filter(
                (item) => item.status === "Failed"
            ).length;

            setStats({
                total,
                pending,
                success,
                failed,
            });
        } catch (error) {
            console.log(error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [])
    );
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Field Check-In</Text>

            <Text style={styles.subtitle}>
                Welcome Back 👋
            </Text>

            <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push("/checkin/New")}
            >
                <Feather
                    name="plus-circle"
                    size={22}
                    color="white"
                />

                <Text style={styles.buttonText}>
                    New Check-In
                </Text>
            </TouchableOpacity>



            <View style={styles.statsGrid}>
                <View style={styles.smallCard}>
                    <MaterialIcons
                        name="cloud-upload"
                        size={28}
                        color="#F59E0B"
                    />

                    <Text style={styles.cardNumber}>
                        {stats.pending}
                    </Text>

                    <Text style={styles.cardText}>
                        Pending
                    </Text>
                </View>

                <View style={styles.smallCard}>
                    <Feather
                        name="x-circle"
                        size={28}
                        color="#EF4444"
                    />

                    <Text style={styles.cardNumber}>
                        {stats.failed}
                    </Text>

                    <Text style={styles.cardText}>
                        Failed
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F7FB",
        paddingHorizontal: 20,
        justifyContent: "center",
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        marginTop: 20,
        color: "#111827",
    },

    subtitle: {
        marginTop: 6,
        color: "#6B7280",
        fontSize: 15,
    },

    primaryButton: {
        marginTop: 30,
        backgroundColor: "#2563EB",
        borderRadius: 16,
        paddingVertical: 16,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
    },

    buttonText: {
        color: "white",
        fontSize: 17,
        fontWeight: "600",
    },

    totalCard: {
        marginTop: 25,
        backgroundColor: "#111827",
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
    },

    totalTitle: {
        color: "#D1D5DB",
        fontSize: 16,
    },

    totalCount: {
        color: "white",
        fontSize: 48,
        fontWeight: "700",
        marginTop: 10,
    },

    statsGrid: {
        marginTop: 25,
        gap: 15,
    },

    smallCard: {
        backgroundColor: "white",
        borderRadius: 18,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
    },

    cardNumber: {
        fontSize: 28,
        fontWeight: "700",
        marginLeft: 15,
        flex: 1,
    },

    cardText: {
        fontSize: 16,
        color: "#6B7280",
        fontWeight: "600",
    },
});