import { Alert, Text, View, Pressable, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Link, router } from 'expo-router';
import FormField from '../../components/FormField';
import { useGlobalContext } from '../../context/GlobalProvider';
import images from '../../constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';


const signIn = async (email, password) => {
    try {
        const signInResponse = await fetch('https://www.realvistamanagement.com/accounts/signin/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (!signInResponse.ok) {
            const errorData = await signInResponse.json();
            throw new Error(errorData.error || 'Failed to sign in');
        }

        // Step 2: Get the token
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

        return { token: tokenData.token, ...userData };
    } catch (error) {
        console.error('Sign-In Error:', error);
        Alert.alert('Sign-In Error', error.message);
        return null;
    }
};


const SignIn = () => {
    const [error, setError] = useState(null);
    const { setUser, setIsLogged } = useGlobalContext();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async () => {
        if (!form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all the fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await signIn(form.email, form.password);
            if (result) {
                setUser({
                    id: result.id,
                    email: result.email,
                    name: result.name,
                    authProvider: 'email',
                });
                setIsLogged(true);
                router.replace('/Home'); // Navigate to home page
            }
        } catch (error) {
            console.error('Login Error:', error);
            Alert.alert('Error', 'Failed to sign in. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <View style={styles.container}>
            {isSubmitting && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#358B8B" />
                    <Text style={styles.loadingText}>Registering...</Text>
                </View>
            )}
            {!isSubmitting && (
                <>
                    <View style={styles.logoContainer}>
                        <Image source={images.logo} style={styles.logo} />
                    </View>
                    <View style={styles.formContainer}>
                        <FormField
                            placeholder="Email"
                            value={form.email}
                            handleChangeText={(e) => setForm({ ...form, email: e })}
                            otherStyles="mt-5"
                            keyboardType="email-address"
                        />

                        <FormField
                            placeholder="Password"
                            value={form.password}
                            handleChangeText={(e) => setForm({ ...form, password: e })}
                            otherStyles="mt-3"
                        />

                        <Link href="/reset-password" style={styles.linkText}>
                            <Text style={styles.forgotPassword}>Forgot your password?</Text>
                        </Link>

                        <Pressable style={styles.button} onPress={submit}>
                            <Text style={styles.buttonText}>Login</Text>
                        </Pressable>
                    </View>
                    <View style={styles.separatorContainer}>
                        <Image source={images.loginpref} style={styles.loginpref} />
                    </View>
                    <View style={styles.googleButtonContainer}>
                        <Pressable style={styles.signUpBtn}>
                            <Link href="/sign-up">
                                <Text style={styles.forgotPassword}>Create new account?</Text>
                            </Link>
                        </Pressable>
                    </View>
                </>
            )}
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
        resizeMode: 'contain',
    },
    loginpref: {
        marginVertical: 10,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        padding: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: 'white',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
        elevation: 1,
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
    linkText: {
        paddingBottom: 20
    },
    signUpBtn: {
        padding: 20
    },
    googleButtonContainer: {
        width: '100%',
    },

    loadingContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#000',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
});
