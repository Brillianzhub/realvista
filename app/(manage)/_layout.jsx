import { Stack } from "expo-router";
import { StatusBar, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';


const ManageLayout = () => {

    const handleBackPress = () => {
        router.replace('/HomeScreen');
    };

    const handleBack = () => {
        router.replace('Portfolio');
    };

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="Manage"
                    options={{
                        headerShown: false,
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
                        headerShown: false,
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
                <Stack.Screen
                    name="PortfolioDetails"
                    options={{
                        headerShown: true,
                        title: "Portfolio Analysis",
                        headerTitleAlign: 'center',
                        headerStyle: { backgroundColor: '#358B8B' },
                        headerTintColor: '#fff',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBack}>
                                <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginLeft: 15 }} />
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
                        headerStyle: { backgroundColor: '#358B8B' },
                        headerTintColor: '#fff',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginLeft: 15 }} />
                            </TouchableOpacity>
                        ),
                    }}
                />

                {/* <Stack.Screen
                    name="PropertyListing"
                    options={{
                        headerShown: true,
                        title: "PropertyListing",
                        headerTitleAlign: 'center',
                        headerStyle: { backgroundColor: '#358B8B' },
                        headerTintColor: '#fff',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginLeft: 15 }} />
                            </TouchableOpacity>
                        ),
                    }}
                /> */}
            </Stack>
            <StatusBar barStyle="light-content" backgroundColor="#358B8B" />
        </>
    );
};

export default ManageLayout;
