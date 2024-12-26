import { Stack } from "expo-router";
import { StatusBar } from "react-native";

const EnterpriseLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="Enterprise"
                    options={{
                        headerShown: false,
                        title: "Enterprise Account",
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

export default EnterpriseLayout;
