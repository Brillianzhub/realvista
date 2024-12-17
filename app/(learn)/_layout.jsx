import { Stack } from "expo-router";
import { StatusBar } from "react-native";

const LearnLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="Learn"
                    options={{
                        headerShown: true,
                        title: "Expert Learn",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#358B8B" },
                        headerTintColor: "#fff",
                        headerLeft: () => null, 
                    }}
                />
            </Stack>

            <StatusBar barStyle="light-content" backgroundColor="#358B8B" />
        </>
    );
};

export default LearnLayout;
