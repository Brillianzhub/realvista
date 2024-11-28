import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";

const ManageLayout = () => {


    const handleBackPress = () => {
        router.replace('/Home');
    };

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="profile"
                    options={{
                        headerShown: true,
                        title: "Profile",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Image
                                    source={require('../../assets/images/backArrow.png')}
                                    style={{ width: 35, height: 35 }}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="about"
                    options={{
                        headerShown: true,
                        title: "About",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Image
                                    source={require('../../assets/images/backArrow.png')}
                                    style={{ width: 35, height: 35 }}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="manage_property"
                    options={{
                        headerShown: true,
                        title: "Manage Property",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Image
                                    source={require('../../assets/images/backArrow.png')}
                                    style={{ width: 35, height: 35 }}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="settings"
                    options={{
                        headerShown: true,
                        title: "Settings",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Image
                                    source={require('../../assets/images/backArrow.png')}
                                    style={{ width: 35, height: 35 }}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="notifications"
                    options={{
                        headerShown: true,
                        title: "Notifications",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Image
                                    source={require('../../assets/images/backArrow.png')}
                                    style={{ width: 35, height: 35 }}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="transactions"
                    options={{
                        headerShown: true,
                        title: "Transactions",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Image
                                    source={require('../../assets/images/backArrow.png')}
                                    style={{ width: 35, height: 35 }}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                        ),
                    }}
                />
            </Stack>

            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        </>
    );
};

export default ManageLayout;
