import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { useTheme } from '@/context/ThemeContext';

const EnterpriseLayout = () => {
    const { colors } = useTheme();

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="Enterprise"
                    options={{
                        headerShown: false,
                        title: "Enterprise Account",
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: colors.background },
                        headerTintColor: colors.tint,
                        headerLeft: () => null,
                        headerBackVisible: false
                    }}
                />
            </Stack>

            <StatusBar barStyle="dark-content" backgroundColor={colors.background}  />
        </>
    );
};

export default EnterpriseLayout;
