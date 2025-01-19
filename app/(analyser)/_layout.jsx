import { Stack } from "expo-router";
import { StatusBar, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const AnalysisLayout = () => {

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="Analysis"
                    options={{
                        headerShown: false,
                        title: "Analysis",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: "#FFFFFF" },
                        headerTintColor: "#358B8B",
                        headerLeft: () => null,
                        headerBackVisible: false
                    }}
                />
            </Stack>

            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        </>
    );
};

export default AnalysisLayout;
