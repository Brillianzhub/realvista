import { Stack } from "expo-router";
import { StatusBar, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";

const ManageLayout = () => {

    const handleBackPress = () => {
        router.replace('/Home');
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

            <StatusBar barStyle="light-content" backgroundColor="#358B8B" />
        </>
    );
};

export default ManageLayout;
