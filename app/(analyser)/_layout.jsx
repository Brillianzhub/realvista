import React, { useEffect, useCallback } from "react";
import { BackHandler, Alert, StatusBar } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const AnalysisLayout = () => {
    const router = useRouter();
    const navigation = useNavigation();

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
                    name="Analysis"
                    options={{
                        headerShown: false,
                        title: "Analysis",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#FFFFFF" },
                        headerTintColor: "#358B8B",
                        headerLeft: () => null,
                        headerBackVisible: false,
                    }}
                />
            </Stack>

            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        </>
    );
};

export default AnalysisLayout;
