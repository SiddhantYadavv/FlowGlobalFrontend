import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Permissions() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.icon}>
                <Feather name="shield" size={70} color="#2563EB" />
            </View>

            <Text style={styles.title}>Permissions Required</Text>

            <Text style={styles.subtitle}>
                Camera and Location permissions are required before creating a check-in.
            </Text>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Grant Permissions</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 25,
        backgroundColor: "#F4F7FB"
    },
    icon: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: "#EAF2FF",
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginTop: 30
    },
    subtitle: {
        marginTop: 15,
        textAlign: "center",
        color: "#6B7280",
        lineHeight: 24
    },
    button: {
        marginTop: 40,
        backgroundColor: "#2563EB",
        paddingHorizontal: 35,
        paddingVertical: 16,
        borderRadius: 15
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16
    }
});