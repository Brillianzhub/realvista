import { Stack } from "expo-router";
import { StatusBar, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const ManageLayout = () => {

    const handleBackPress = () => {
        router.replace('/HomeScreen');
    };

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="Manage"
                    options={{
                        headerShown: true,
                        title: "Manage Portfolio",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#358B8B" },
                        headerTintColor: "#fff",
                        headerLeft: () => null,
                        headerBackVisible: false
                    }}
                />
                <Stack.Screen
                    name="General"
                    options={{
                        headerShown: true,
                        title: "General",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#358B8B" },
                        headerTintColor: "#fff",
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
                        headerStyle: { backgroundColor: "#358B8B" },
                        headerTintColor: "#fff",
                        headerBackVisible: false,
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
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
                        headerStyle: { backgroundColor: "#358B8B" },
                        headerTintColor: "#fff",
                        headerBackVisible: false,
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
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
                        headerStyle: { backgroundColor: "#358B8B" },
                        headerTintColor: "#fff",
                        headerBackVisible: false,
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                        ),
                    }}
                />
            </Stack>
            <StatusBar barStyle="light-content" backgroundColor="#358B8B" />
        </>
    );
};

export default ManageLayout;
