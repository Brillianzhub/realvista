import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateNewPassword = (text) => {
        setNewPassword(text);
        if (text.length < 8) {
            setPasswordError('Password must be at least 8 characters long.');
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(text)) {
            setPasswordError('Password must contain at least one special character.');
        } else {
            setPasswordError('');
        }
    };

    const validateConfirmPassword = (text) => {
        setConfirmNewPassword(text);
        if (text !== newPassword) {
            setConfirmPasswordError('Passwords do not match.');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        if (newPassword.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters long.');
            return;
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            Alert.alert('Error', 'Password must contain at least one special character.');
            return;
        }

        if (passwordError || confirmPasswordError) {
            Alert.alert('Error', 'Please fix password errors before submitting.');
            return;
        }

        setIsSubmitting(true);

        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found.');
            }

            const response = await fetch(
                'https://www.realvistamanagement.com/accounts/change-password/',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                    body: JSON.stringify({
                        old_password: oldPassword,
                        new_password: newPassword,
                        confirm_password: confirmNewPassword,
                    }),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to change password.');
            }

            Alert.alert('Success', 'Your password has been changed successfully.');

            router.replace('/HomeScreen');

        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Old Password"
                    secureTextEntry={!showOldPassword}
                    value={oldPassword}
                    onChangeText={setOldPassword}
                />
                <Pressable onPress={() => setShowOldPassword(!showOldPassword)}>
                    <Ionicons name={showOldPassword ? 'eye-off' : 'eye'} size={24} color="#666" />
                </Pressable>
            </View>

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={validateNewPassword}
                />
                <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Ionicons name={showNewPassword ? 'eye-off' : 'eye'} size={24} color="#666" />
                </Pressable>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    secureTextEntry={!showConfirmNewPassword}
                    value={confirmNewPassword}
                    onChangeText={validateConfirmPassword}
                />
                <Pressable onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                    <Ionicons name={showConfirmNewPassword ? 'eye-off' : 'eye'} size={24} color="#666" />
                </Pressable>
            </View>
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

            <Pressable
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleChangePassword}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>Change Password</Text>
            </Pressable>
        </View>
    );
};

export default ChangePassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
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
        marginBottom: 10,
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
