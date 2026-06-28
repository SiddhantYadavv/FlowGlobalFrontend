import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllCheckIns, saveCheckIn } from "../../services/checkinService";
import { syncPendingCheckIns } from "../../services/syncManager";


export default function NewCheckIn() {
    const [permission, requestPermission] = useCameraPermissions();
    const [locationPermission, setLocationPermission] = useState(null);

    const cameraRef = useRef(null);
    const [showCamera, setShowCamera] = useState(false);
    const [photo, setPhoto] = useState(null);

    const [location, setLocation] = useState(null);

    const [notes, setNotes] = useState("");

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        checkLocationPermission();
    }, []);

    const checkLocationPermission = async () => {
        const { status } = await Location.getForegroundPermissionsAsync();

        if (status === "granted") {
            setLocationPermission(true);
            getLocation();
        } else {
            setLocationPermission(false);
        }
    };

    const requestLocationPermission = async () => {
        const { status } =
            await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
            setLocationPermission(true);
            getLocation();
        } else {
            setLocationPermission(false);
        }
    };

    const getLocation = async () => {
        const lastKnown = await Location.getLastKnownPositionAsync();

        if (lastKnown) {
            setLocation(lastKnown.coords);
        }

        const current = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });

        setLocation(current.coords);
    };

    const takePicture = async () => {
        if (!cameraRef.current) return;

        try {
            const result = await cameraRef.current.takePictureAsync({
                quality: 0.7,
                skipProcessing: true,
            });

            setPhoto(result);

            setShowCamera(false);

        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async () => {
        if (loading) return;

        if (!photo) {
            alert("Please capture a photo.");
            return;
        }

        if (!location) {
            alert("Location not available.");
            return;
        }

        try {
            setLoading(true);

            await saveCheckIn({
                photo: photo.uri,
                latitude: location.latitude,
                longitude: location.longitude,
                notes,
            });

            await syncPendingCheckIns();

            const data = await getAllCheckIns();
            console.log(data);

            alert("Check-In saved successfully!");

            setPhoto(null);
            setNotes("");
        } catch (error) {
            console.log(error);
            alert("Failed to save check-in.");
        } finally {
            setLoading(false);
        }
    };

    if (!permission || locationPermission === null) {
        return null;
    }

    if (!permission.granted || !locationPermission) {
        return (
            <SafeAreaView style={styles.container}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 20,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "600",
                            marginBottom: 20,
                            textAlign: "center",
                        }}
                    >
                        Camera and Location permissions are required.
                    </Text>

                    {!permission.granted && (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={requestPermission}
                        >
                            <Text style={styles.buttonText}>
                                Grant Camera Permission
                            </Text>
                        </TouchableOpacity>
                    )}

                    {!locationPermission && (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={requestLocationPermission}
                        >
                            <Text style={styles.buttonText}>
                                Grant Location Permission
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={20}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingBottom: 30 }}
                    >
                        {/* Header */}

                        <View style={styles.header}>
                            <Text style={styles.title}>New Check-In</Text>

                            <Text style={styles.subtitle}>
                                Capture your visit details
                            </Text>
                        </View>

                        {/* Photo */}

                        {
                            photo ? (
                                <View>

                                    <Image
                                        source={{ uri: photo.uri }}
                                        style={styles.preview}
                                    />

                                    <TouchableOpacity
                                        style={styles.retake}
                                        onPress={() => {
                                            setPhoto(null);
                                            setShowCamera(true);
                                        }}
                                    >
                                        <Text style={{ color: "white", fontWeight: "600" }}>
                                            Retake
                                        </Text>
                                    </TouchableOpacity>

                                </View>

                            ) : showCamera ? (

                                <CameraView
                                    ref={cameraRef}
                                    style={{
                                        height: 350,
                                        borderRadius: 20,
                                    }}
                                >
                                    <TouchableOpacity
                                        style={styles.captureButton}
                                        onPress={takePicture}
                                    >
                                        <View style={styles.innerCircle} />
                                    </TouchableOpacity>
                                </CameraView>

                            ) : (

                                <TouchableOpacity
                                    style={styles.photoCard}
                                    onPress={() => setShowCamera(true)}
                                >

                                    <Feather
                                        name="camera"
                                        size={45}
                                        color="#2563EB"
                                    />

                                    <Text style={styles.photoText}>
                                        Open Camera
                                    </Text>

                                </TouchableOpacity>

                            )
                        }

                        {/* Location */}

                        <Text style={styles.label}>Location</Text>

                        <View style={styles.locationCard}>
                            <View style={styles.locationRow}>
                                <MaterialIcons
                                    name="location-on"
                                    size={24}
                                    color="#2563EB"
                                />

                                <Text style={styles.locationTitle}>
                                    Current GPS Coordinates
                                </Text>
                            </View>

                            <Text style={styles.coordinate}>
                                Latitude : {location?.latitude ?? "--"}
                            </Text>

                            <Text style={styles.coordinate}>
                                Longitude : {location?.longitude ?? "--"}
                            </Text>
                        </View>

                        {/* Notes */}

                        <Text style={styles.label}>Notes</Text>

                        <TextInput
                            placeholder="Enter visit notes..."
                            multiline
                            value={notes}
                            onChangeText={setNotes}
                            style={styles.notes}
                        />

                        {/* Submit */}

                        <TouchableOpacity
                            style={[
                                styles.button,
                                loading && { opacity: 0.7 },
                            ]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <ActivityIndicator color="white" />
                                    <Text style={styles.buttonText}>Submitting...</Text>
                                </>
                            ) : (
                                <>
                                    <Feather
                                        name="check-circle"
                                        color="white"
                                        size={22}
                                    />
                                    <Text style={styles.buttonText}>
                                        Submit Check-In
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F7FB",
        paddingHorizontal: 20,
    },

    header: {
        marginTop: 20,
        marginBottom: 25,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        color: "#111827",
    },

    subtitle: {
        marginTop: 6,
        color: "#6B7280",
    },

    label: {
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 10,
        marginTop: 15,
    },

    photoCard: {
        height: 220,
        borderRadius: 18,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#2563EB",
        backgroundColor: "#EEF4FF",
        justifyContent: "center",
        alignItems: "center",
    },

    photoText: {
        marginTop: 15,
        fontSize: 18,
        fontWeight: "600",
    },

    photoSub: {
        color: "#6B7280",
        marginTop: 5,
    },

    locationCard: {
        backgroundColor: "white",
        borderRadius: 18,
        padding: 18,
    },

    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },

    locationTitle: {
        marginLeft: 10,
        fontWeight: "600",
        fontSize: 16,
    },

    coordinate: {
        color: "#6B7280",
        marginTop: 5,
    },

    notes: {
        backgroundColor: "white",
        borderRadius: 18,
        padding: 16,
        height: 140,
        textAlignVertical: "top",
    },

    button: {
        marginTop: 30,
        marginBottom: 30,
        backgroundColor: "#2563EB",
        borderRadius: 15,
        padding: 18,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },

    buttonText: {
        color: "white",
        fontSize: 17,
        fontWeight: "600",
    },
    preview: {
        height: 350,
        borderRadius: 20,
    },

    captureButton: {
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },

    innerCircle: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: "#2563EB",
    },

    retake: {
        marginTop: 15,
        backgroundColor: "#111827",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },
});