import { Stack } from "expo-router";
import { StatusBar } from "react-native";

const TrendsLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="Trends"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>

            <StatusBar barStyle="light-content" backgroundColor="#358B8B" />
        </>
    );
};

export default TrendsLayout;
