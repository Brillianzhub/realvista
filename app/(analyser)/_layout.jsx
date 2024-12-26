import { Stack } from "expo-router";
import { StatusBar, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const AnalysisLayout = () => {

    const handleBackPress = () => {
        router.replace('/HomeScreen');
    };

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="Analysis"
                    options={{
                        headerShown: false,
                        title: "Analysis",
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

export default AnalysisLayout;
