import * as LocalAuthentication from "expo-local-authentication";

export async function authenticateUser() {
    try {
        // Check if biometric hardware exists
        const hasHardware =
            await LocalAuthentication.hasHardwareAsync();

        if (!hasHardware) {
            return {
                success: true,
                message: "No biometric hardware",
            };
        }

        // Check if biometrics are enrolled
        const isEnrolled =
            await LocalAuthentication.isEnrolledAsync();

        if (!isEnrolled) {
            return {
                success: true,
                message: "No biometrics enrolled",
            };
        }

        // Authenticate user
        const result =
            await LocalAuthentication.authenticateAsync({
                promptMessage: "Unlock Check-In App",
                cancelLabel: "Cancel",
                fallbackLabel: "Use Passcode",
                disableDeviceFallback: false,
            });

        return result;
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: error.message,
        };
    }
}