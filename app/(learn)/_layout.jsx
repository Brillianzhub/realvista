import React, { useEffect, useCallback } from "react";
import { BackHandler, StatusBar } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";


const LearnLayout = () => {
    const router = useRouter();
    const { colors } = useTheme();
    const handleBackPress = useCallback(() => {
        router.replace("(tabs)/HomeScreen");

        return true;
    }, [router]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            handleBackPress
        );

        return () => backHandler.remove();
    }, [handleBackPress]);

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="Learn"
                    options={{
                        headerShown: false,
                        title: "Expert Learn",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: colors.background },
                        headerTintColor: colors.tint,
                        headerLeft: () => null,
                        headerBackVisible: false,
                    }}
                />
                <Stack.Screen
                    name="Reviews"
                    options={{
                        headerShown: true,
                        title: "Reviews",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: colors.background },
                        headerTintColor: colors.tint,
                        headerLeft: () => null,
                        headerBackVisible: true,
                    }}
                />
                <Stack.Screen
                    name="Payment"
                    options={{
                        headerShown: true,
                        title: "Payment",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: colors.background },
                        headerTintColor: colors.tint,
                        headerLeft: () => null,
                        headerBackVisible: true,
                    }}
                />
            </Stack>

            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        </>
    );
};

export default LearnLayout;
