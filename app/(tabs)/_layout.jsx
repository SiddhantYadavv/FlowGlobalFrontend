import {
    Feather,
    MaterialIcons
} from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { COLORS } from "../../constants/colors";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
            }}
        >
            <Tabs.Screen
                name="Home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="home" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="Queue"
                options={{
                    title: "Queue",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons
                            name="cloud-upload"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            {/* <Tabs.Screen
                name="Map"
                options={{
                    title: "Map",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5
                            name="map-marked-alt"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            /> */}
        </Tabs>
    );
}