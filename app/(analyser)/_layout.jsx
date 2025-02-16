import React, { useEffect, useCallback } from "react";
import { BackHandler, Alert, StatusBar, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';



const AnalysisLayout = () => {
    const router = useRouter();
    const navigation = useNavigation();
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
                    name="Analysis"
                    options={{
                        headerShown: false,
                        title: "Analysis",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#FFFFFF" },
                        headerTintColor: colors.tint,
                        headerLeft: () => null,
                        headerBackVisible: false,
                    }}
                />
                <Stack.Screen
                    name="TargetList"
                    options={{
                        headerShown: true,
                        title: "Target List",
                        headerTitleAlign: "center",
                        headerStyle: {
                            fontFamily: 'RobotoSerif-SemiBold',
                            backgroundColor: colors.background
                        },
                        headerTintColor: colors.tint,
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color="#358B8B" />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="TargetProgressDetail"
                    options={{
                        headerShown: true,
                        title: "Target Progress",
                        headerTitleAlign: "center",
                        headerStyle: {
                            fontFamily: 'RobotoSerif-SemiBold',
                            backgroundColor: colors.background
                        },
                        headerTintColor: colors.tint,
                    }}
                />
            </Stack>

            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        </>
    );
};

export default AnalysisLayout;
