import { Stack } from "expo-router";
import { StatusBar, TouchableOpacity, BackHandler } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useCallback } from "react";



const ManageLayout = () => {

    const handleBack = () => {
        router.replace('Portfolio');
    };

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
                    name="Manage"
                    options={{
                        headerShown: false,
                        title: "Manage Portfolio",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#FFFFFF" },
                        headerTintColor: "#358B8B",
                        headerLeft: () => null,
                        headerBackVisible: false
                    }}
                />
                <Stack.Screen
                    name="General"
                    options={{
                        headerShown: false,
                        title: "General",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#FFFFFF" },
                        headerTintColor: "#358B8B",
                        headerLeft: () => null,
                        headerBackVisible: false
                    }}
                />
                <Stack.Screen
                    name="Transactions"
                    options={{
                        headerShown: true,
                        title: "Transactions",
                        headerTitleAlign: 'center',
                        headerStyle: { backgroundColor: "#FFFFFF" },
                        headerTintColor: "#358B8B",
                        headerBackVisible: false,
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color="#358B8B" />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="Notifications"
                    options={{
                        headerShown: true,
                        title: "Notifications",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#FFFFFF" },
                        headerTintColor: "#358B8B",
                        headerBackVisible: false,
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color="#358B8B" />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="Settings"
                    options={{
                        headerShown: true,
                        title: "Settings",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#FFFFFF" },
                        headerTintColor: "##358B8B",
                        headerBackVisible: false,
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color="#358B8B" />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="PortfolioDetails"
                    options={{
                        headerShown: true,
                        title: "Portfolio Analysis",
                        headerTitleAlign: 'center',
                        headerStyle: { backgroundColor: '#FFFFFF' },
                        headerTintColor: '#358B8B',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBack}>
                                <Ionicons name="arrow-back" size={24} color="#358B8B" style={{ marginLeft: 15 }} />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="Investment"
                    options={{
                        headerShown: true,
                        title: "RealInvest",
                        headerTitleAlign: 'center',
                        headerStyle: { backgroundColor: '#FFFFFF' },
                        headerTintColor: '#358B8B',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color="#358B8B" style={{ marginLeft: 15 }} />
                            </TouchableOpacity>
                        ),
                    }}
                />

                <Stack.Screen
                    name="Bookmarks"
                    options={{
                        headerShown: true,
                        title: "Wish Items",
                        headerTitleAlign: 'center',
                        headerStyle: { backgroundColor: '#FFFFFF' },
                        headerTintColor: '#358B8B',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color="#358B8B" style={{ marginLeft: 15 }} />
                            </TouchableOpacity>
                        ),
                    }}
                />
            </Stack>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        </>
    );
};

export default ManageLayout;
