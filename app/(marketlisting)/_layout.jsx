import React, { useEffect, useCallback } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { TouchableOpacity, BackHandler } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

const MarketListingLayout = () => {

    const handleBackPress = useCallback(() => {
        router.replace("(manage)/Manage");

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
                    name="MarketListing"
                    options={{
                        headerShown: true,
                        title: "Market Listing",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#FFFFFF" },
                        headerTintColor: "#358B8B",
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color="#358B8B" style={{ marginLeft: 5 }} />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="AddListing"
                    options={{
                        headerShown: true,
                        title: "Add Listing",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#FFFFFF" },
                        headerTintColor: "#358B8B",
                        headerBackVisible: true
                    }}
                />
                <Stack.Screen
                    name="UpdateListing"
                    options={{
                        headerShown: true,
                        title: "Update Listing",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#FFFFFF" },
                        headerTintColor: "#358B8B",
                        headerBackVisible: true
                    }}
                />
                <Stack.Screen
                    name="MarketFeatures"
                    options={{
                        headerShown: true,
                        title: "Property Features",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#FFFFFF" },
                        headerTintColor: "#358B8B",
                        headerBackVisible: true
                    }}
                />

                <Stack.Screen
                    name="AddImages"
                    options={{
                        headerShown: true,
                        title: "Upload Files & Images",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#FFFFFF" },
                        headerTintColor: "#358B8B",
                        headerBackVisible: true
                    }}
                />

                <Stack.Screen
                    name="ManageListing"
                    options={{
                        headerShown: true,
                        title: "Manage Listing",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#FFFFFF" },
                        headerTintColor: "#358B8B",
                        headerBackVisible: true
                    }}
                />

                <Stack.Screen
                    name="ListingCoordinates"
                    options={{
                        headerShown: true,
                        title: "Listing Coordinates",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#FFFFFF" },
                        headerTintColor: "#358B8B",
                        headerBackVisible: true
                    }}
                />
            </Stack>

            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        </>
    );
};

export default MarketListingLayout;