import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useTheme } from '@/context/ThemeContext';

const AuthLayout = () => {

    const { colors } = useTheme();

    const handleBackPress = () => {
        router.replace('/HomeScreen');
    };

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="sign-in"
                    options={{
                        headerShown: false,
                        title: "Sign In",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color={colors.tint} />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="sign-up"
                    options={{
                        headerShown: false,
                        title: "Sign Up",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color={colors.tint} />
                            </TouchableOpacity>
                        ),
                    }}
                />

                <Stack.Screen
                    name="verify-email"
                    options={{
                        headerShown: false,
                        title: "Email Verification",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color={colors.tint} />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="verify-otp"
                    options={{
                        headerShown: false,
                        // title: "Email Verification",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color={colors.tint} />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="forgot-password"
                    options={{
                        headerShown: false,
                        title: "Forgot Password",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color={colors.tint} />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="reset-password"
                    options={{
                        headerShown: false,
                        // title: "Forgot Password",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color={colors.tint} />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="update-profile"
                    options={{
                        headerShown: true,
                        title: "Update Profile",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color="#000" />
                            </TouchableOpacity>
                        ),
                    }}
                />

                <Stack.Screen
                    name="change-password"
                    options={{
                        headerShown: true,
                        title: "Change Password",
                        headerTitleAlign: 'center',
                        headerTintColor: colors.tint,
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color={colors.tint} />
                            </TouchableOpacity>
                        ),
                    }}
                />
            </Stack>

            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        </>
    );
};

export default AuthLayout;
