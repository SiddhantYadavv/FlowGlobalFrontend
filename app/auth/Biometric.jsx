import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authenticateUser } from "../../services/biometricService";

export default function Biometric() {
    const [loading, setLoading] = useState(true);

    async function unlock() {
        setLoading(true);

        const result = await authenticateUser();

        setLoading(false);

        if (result.success) {
            router.replace("/(tabs)/Home");
        }
    }

    useEffect(() => {
        unlock();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Feather
                name="lock"
                size={90}
                color="#2563EB"
            />

            <Text style={styles.title}>
                Secure Check-In
            </Text>

            <Text style={styles.subtitle}>
                Authenticate using Face ID or Fingerprint
            </Text>

            {loading ? (
                <ActivityIndicator
                    size="large"
                    style={{ marginTop: 30 }}
                />
            ) : (
                <TouchableOpacity
                    style={styles.button}
                    onPress={unlock}
                >
                    <Text style={styles.buttonText}>
                        Try Again
                    </Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F7FB",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 25,
    },

    title: {
        marginTop: 30,
        fontSize: 28,
        fontWeight: "700",
    },

    subtitle: {
        marginTop: 12,
        textAlign: "center",
        color: "#6B7280",
        fontSize: 16,
    },

    button: {
        marginTop: 40,
        backgroundColor: "#2563EB",
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 12,
    },

    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});