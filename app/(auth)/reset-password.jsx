import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalContext } from '../../context/GlobalProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResetPassword = () => {
    const { email, otp } = useLocalSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const { setUser, isLogged, setIsLogged } = useGlobalContext();


    const validatePassword = (text) => {
        setPassword(text);

        if (text.length < 8) {
            setPasswordError('Password must be at least 8 characters long.');
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(text)) {
            setPasswordError('Password must contain at least one special character.');
        } else {
            setPasswordError('');
        }
    };

    const validateConfirmPassword = (text) => {
        setConfirmPassword(text);

        if (text !== password) {
            setConfirmPasswordError('Passwords do not match.');
        } else {
            setConfirmPasswordError('');
        }
    };


    const handleResetPassword = async () => {

        if (!password || !confirmPassword) {
            Alert.alert('Error', 'Please enter both password fields.');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters long.');
            return;
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            Alert.alert('Error', 'Password must contain at least one special character.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(
                'https://www.realvistamanagement.com/accounts/password-reset/',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to reset password.');
            }

            const tokenResponse = await fetch('https://www.realvistamanagement.com/portfolio/api-token-auth/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
            });

            const tokenData = await tokenResponse.json();
            if (!tokenData.token) {
                throw new Error('Authentication token not provided');
            }

            await AsyncStorage.setItem('authToken', tokenData.token);

            const userResponse = await fetch('https://www.realvistamanagement.com/accounts/current-user/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${tokenData.token}`,
                },
            });

            if (!userResponse.ok) {
                const errorData = await userResponse.json();
                throw new Error(errorData.error || 'Failed to fetch user details');
            }

            const userData = await userResponse.json();

            setUser({
                id: userData.id,
                email: userData.email,
                name: userData.name,
                firstName: userData.first_name,
                authProvider: userData.auth_provider,
                isActive: userData.is_active,
                isStaff: userData.is_staff,
                dateJoined: userData.date_joined,
                profile: userData.profile,
                preference: userData.preference,
                groups: userData.groups,
            });
            setIsLogged(true);
            router.replace('/HomeScreen');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.instruction}>
                Enter your new password to complete the reset process.
            </Text>

            <View style={styles.passwordMainContainer}>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={validatePassword}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={20}
                            color="#666"
                        />
                    </Pressable>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <View style={styles.passwordMainContainer}>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={validateConfirmPassword}
                    />
                    <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Ionicons
                            name={showConfirmPassword ? 'eye-off' : 'eye'}
                            size={20}
                            color="#666"
                        />
                    </Pressable>
                </View>
                {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            </View>

            <Pressable
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>Reset Password</Text>
            </Pressable>
        </View>
    );
};

export default ResetPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    instruction: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        marginBottom: 20,
    },
    passwordMainContainer: {
        marginBottom: 15,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
    },

    button: {
        height: 50,
        backgroundColor: '#FB902E',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
