import { Stack } from "expo-router";
import useAppSync from "../hooks/useAppSync";
import useSync from "../hooks/useSync";

export default function RootLayout() {

  useSync();
  useAppSync();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/Biometric" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="checkin/New"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}