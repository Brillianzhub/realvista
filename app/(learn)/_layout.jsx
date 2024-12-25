import { Stack } from "expo-router";
import { StatusBar } from "react-native";

const LearnLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="Learn"
                    options={{
                        headerShown: false,
                        title: "Expert Learn",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#358B8B" },
                        headerTintColor: "#fff",
                        headerLeft: () => null, 
                        headerBackVisible: false
                    }}
                />
            </Stack>

            <StatusBar barStyle="light-content" backgroundColor="#358B8B" />
        </>
    );
};

export default LearnLayout;
