import React, { useEffect, useCallback } from "react";
import { BackHandler, StatusBar } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

const EnterpriseLayout = () => {
    const { colors } = useTheme();
    const router = useRouter();

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
                    name="Enterprise"
                    options={{
                        headerShown: false,
                        title: "Enterprise Account",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: colors.background },
                        headerTintColor: colors.tint,
                        headerLeft: () => null,
                        headerBackVisible: false,
                    }}
                />
            </Stack>

            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        </>
    );
};

export default EnterpriseLayout;
