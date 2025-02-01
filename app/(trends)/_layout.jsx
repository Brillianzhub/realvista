import React, { useEffect, useCallback } from "react";
import { BackHandler, StatusBar } from "react-native";
import { Stack, useRouter } from "expo-router";

const TrendsLayout = () => {
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
                    name="Trends"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>

            <StatusBar barStyle="light-content" backgroundColor="#358B8B" />
        </>
    );
};

export default TrendsLayout;
