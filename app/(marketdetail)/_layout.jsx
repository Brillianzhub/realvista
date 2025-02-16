import React, { useEffect, useCallback } from "react";
import { BackHandler, StatusBar, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';


const MarketDetailLayout = () => {
    const router = useRouter();
    const { colors } = useTheme();

    const handleBackPress = useCallback(() => {
        router.replace("(tabs)/Market");

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
                    name="MarketListingDetails"
                    options={{
                        headerShown: true,
                        title: "Property Details",
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
                    name="OwnerProfile"
                    options={{
                        headerShown: true,
                        title: "Dealer Profile",
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
            </Stack>

            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        </>
    );
};

export default MarketDetailLayout;
