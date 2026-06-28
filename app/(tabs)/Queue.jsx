import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllCheckIns, markPending } from "../../services/checkinService";
import { syncPendingCheckIns } from "../../services/syncManager";


export default function Queue() {
    const [checkIns, setCheckIns] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const interval = setInterval(() => {
                loadCheckIns();
            }, 1000);

            return () => clearInterval(interval);
        }, [])
    );

    const loadCheckIns = async () => {
        try {
            const data = await getAllCheckIns();
            setCheckIns(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = async (id) => {
        await markPending(id);
        await syncPendingCheckIns();
        loadCheckIns();
    };

    const renderStatus = (status) => {
        switch (status) {
            case "Pending":
                return styles.pending;

            case "Uploading":
                return styles.uploading;

            case "Success":
                return styles.success;

            case "Failed":
                return styles.failed;

            default:
                return styles.pending;
        }
    };
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }
    if (!checkIns.length) {
        return (
            <SafeAreaView style={styles.container}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Feather
                        name="cloud"
                        size={60}
                        color="#CBD5E1"
                    />

                    <Text
                        style={{
                            marginTop: 20,
                            fontSize: 20,
                            fontWeight: "700",
                        }}
                    >
                        Queue Empty
                    </Text>

                    <Text
                        style={{
                            color: "#6B7280",
                            marginTop: 8,
                        }}
                    >
                        Offline check-ins will appear here.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Upload Queue</Text>

            <Text style={styles.subtitle}>
                Offline check-ins waiting for upload
            </Text>

            <FlatList
                data={checkIns}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 20 }}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.imagePlaceholder}>
                            <Image
                                source={{ uri: item.photo }}
                                style={styles.image}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={styles.note}>
                                {item.notes || "No notes"}
                            </Text>

                            <Text style={styles.location}>
                                📍 {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
                            </Text>
                            <Text style={styles.time}>
                                {new Date(item.createdAt).toLocaleString()}
                            </Text>

                            <View
                                style={[
                                    styles.status,
                                    renderStatus(item.status),
                                ]}
                            >
                                <Text style={styles.statusText}>
                                    {item.status}
                                </Text>
                            </View>
                        </View>

                        {item.status === "Failed" && (
                            <TouchableOpacity style={styles.retry} onPress={() => handleRetry(item.id)}>
                                <Feather
                                    name="refresh-cw"
                                    color="white"
                                    size={16}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F7FB",
        paddingHorizontal: 20,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        marginTop: 20,
    },

    subtitle: {
        color: "#6B7280",
        marginTop: 6,
    },

    card: {
        backgroundColor: "white",
        borderRadius: 18,
        padding: 16,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
    },

    imagePlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 15,
        backgroundColor: "#EEF4FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },

    note: {
        fontWeight: "700",
        fontSize: 16,
    },

    location: {
        marginTop: 6,
        color: "#6B7280",
    },

    status: {
        alignSelf: "flex-start",
        marginTop: 12,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    statusText: {
        color: "white",
        fontWeight: "600",
    },

    pending: {
        backgroundColor: "#F59E0B",
    },

    uploading: {
        backgroundColor: "#3B82F6",
    },

    success: {
        backgroundColor: "#22C55E",
    },

    failed: {
        backgroundColor: "#EF4444",
    },

    retry: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 15,
        marginRight: 15,
    },
    time: {
        color: "#9CA3AF",
        fontSize: 12,
        marginTop: 4,
    },
});