import { StyleSheet, Text, View, TextInput, Pressable, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import images from '../../constants/images'; // Ensure the path is correct
import { Link, router } from 'expo-router';


const SignIn = () => {
    // State variables for email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Function to handle login
    const handleLogin = async () => {
        // Basic validation
        if (!email || !password) {
            Alert.alert('Please enter your email and password.');
            return;
        }

        try {
            const response = await fetch('https://your-backend-api.com/login', { // Replace with your backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed. Please check your credentials.');
            }

            const data = await response.json();
            console.log('Login successful:', data);
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    // Function to handle Google login (placeholder)
    const handleGoogleLogin = () => {
        // Implement Google login logic here
        Alert.alert('Google login not implemented yet.');
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={images.logo}
                    style={styles.logo}
                />
            </View>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <Link href="/reset-password" className="text-lg font-psemibold text-secondary">
                    <Text style={styles.forgotPassword}>Forgot your password ?</Text>
                </Link>
                <Pressable style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
                <Pressable>
                    <Link href="/sign-up">
                        <Text style={styles.forgotPassword}>Don't have account ?</Text>
                    </Link>
                </Pressable>
            </View>
            <View style={styles.separatorContainer}>
                <Image
                    source={images.loginpref}
                    style={styles.loginpref}
                />
            </View>
            <View style={styles.googleButtonContainer}>
                <Pressable style={styles.googleButton} onPress={handleGoogleLogin}>
                    <Image
                        source={images.google}
                    />
                    <Text style={styles.googleButtonText}>Login with Google</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default SignIn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    logoContainer: {
        marginBottom: 40,
    },
    logo: {
        width: 214,
        height: 48,
        resizeMode: 'contain', // Ensures the logo maintains its aspect ratio
    },
    loginpref: {
        marginVertical: 10,
    },
    formContainer: {
        width: '100%', // Use the full width for the form
        // marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff', // White background for input fields
        elevation: 1, // Adds a slight shadow effect
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#FB902E',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    googleButton: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        borderRadius: 30,
        borderColor: '#FB902E',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    googleButtonText: {
        color: '#358B8B',
        fontSize: 18,
    },
    forgotPassword: {
        color: '#358B8B',
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 16,
    },
    separatorContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    // separator: {
    //     fontSize: 16,
    //     color: '#888',
    // },
    googleButtonContainer: {
        width: '100%',
    },
});
