import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
}) {
    return <FontAwesome size={28} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                // Disable the static render of the header on web
                // to prevent a hydration error in React Navigation v6.
                headerShown: useClientOnlyValue(false, true),
                
                headerRight: () => (
                    <Link href="/match-management" asChild>
                        <Pressable>
                            {({ pressed }) => (
                                <FontAwesome
                                    name="plus"
                                    size={25}
                                    color={Colors[colorScheme ?? "light"].text}
                                    style={{
                                        marginRight: 15,
                                        opacity: pressed ? 0.5 : 1,
                                    }}
                                />
                            )}
                        </Pressable>
                    </Link>
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Tutte le partite",
                    tabBarIcon: ({ color }) => <TabBarIcon name="globe" color={color} />,
                }}
            />
            <Tabs.Screen
                name="yours"
                options={{
                    title: "Le tue partite",
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                }}
            />
            <Tabs.Screen
                name="joined"
                options={{
                    title: "Partite a cui partecipi",
                    tabBarIcon: ({ color }) => <TabBarIcon name="pencil" color={color} />,
                }}
            />
        </Tabs>
    );
}
