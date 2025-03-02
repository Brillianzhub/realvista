import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    ScrollView,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Alert,
    Image,
    Linking,
} from 'react-native';
import images from '../../constants/images';
import { useGlobalContext } from '../../context/GlobalProvider';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import FingerprintAuth from '../../components/FingerprintAuth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { googleAuthSignIn } from '../../lib/googleAuthSignIn';


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
    const { setUser, isLogged, setIsLogged } = useGlobalContext();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const configureGoogleSignIn = async () => {
        GoogleSignin.configure({
            webClientId: "249644969622-pm62s6ipfbkqg65ifefsknur3khttf0f.apps.googleusercontent.com",
            offlineAccess: true,
        });
    };

    useEffect(() => {
        configureGoogleSignIn();
    }, []);

    const handleGoogleAuth = async () => {
        setIsSubmitting(true);
        try {
            await googleAuthSignIn({ setUser, setIsLogged, router });
        } catch (error) {
            console.error('Google Auth Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken')

            if (!token) {
                console.log('Use password')
                return;
            }

            const response = await fetch('https://www.realvistamanagement.com/accounts/current-user/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await response.json();
            router.replace('/HomeScreen', { user: userData });
        } catch (error) {
            console.error('Error fetching user data:', error);
            Alert.alert('Error', 'Failed to fetch user data.');
        }
    };


    useEffect(() => {
        if (!isLogged) return;

        const { authenticate } = FingerprintAuth({
            onSuccess: fetchUserData,
            onFailure: () => {
                // Do nothing when fingerprint authentication fails or is canceled
            },
        });

        authenticate();
    }, [isLogged]);


    const handleSubmit = async () => {
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
                    firstName: result.first_name,
                    authProvider: result.auth_provider,
                    isActive: result.is_active,
                    isStaff: result.is_staff,
                    dateJoined: result.date_joined,
                    profile: result.profile,
                    preference: result.preference,
                    subscription: result.subscription,
                    referral_code: result.referral_code,
                    referrer: result.referrer,
                    referred_users_count: result.referred_users_count,
                    total_referral_earnings: result.total_referral_earnings,
                    groups: result.groups,
                });
                setIsLogged(true);
                router.replace('/HomeScreen');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to sign in. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    {isSubmitting && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#358B8B" />
                            <Text style={styles.loadingText}>Processing...</Text>
                        </View>
                    )}
                    {!isSubmitting && (
                        <>
                            <View style={styles.logoContainer}>
                                <Image source={images.logo} style={styles.logo} />
                            </View>

                            <TextInput
                                style={[styles.input]}
                                placeholder="Email"
                                keyboardType="email-address"
                                value={form.email}
                                onChangeText={(e) => setForm({ ...form, email: e })}
                            />
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputp}
                                    placeholder="Password"
                                    secureTextEntry={!showPassword}
                                    value={form.password}
                                    onChangeText={(e) => setForm({ ...form, password: e })}
                                />
                                <Pressable onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={24}
                                        color="gray"
                                    />
                                </Pressable>
                            </View>
                            <Link href="/forgot-password" style={{ color: '#358B8B', marginBottom: 20 }}>
                                Forgot your password ?
                            </Link>

                            <Pressable style={[styles.button]} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Login</Text>
                            </Pressable>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Don't have an account with us ?</Text>
                                <Link href="/sign-up" style={styles.link}>
                                    Sign Up
                                </Link>
                            </View>
                            <View style={{ marginVertical: 10 }}>
                                <Text style={{ textAlign: 'center' }}>OR</Text>
                            </View>
                            <View style={{ marginVertical: 20 }}>
                                <Pressable style={[styles.googleBtn, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }]} onPress={handleGoogleAuth}>
                                    <Image
                                        source={images.google}
                                        style={styles.googleBtnImage}
                                    />
                                    <Text style={[styles.buttonText, { color: '#000', textAlign: 'center' }]}>Login with Google</Text>
                                </Pressable>
                            </View>
                            <View style={{ marginVertical: 10 }}>
                                <Text style={styles.text}>
                                    By continuing, you agree to our{' '}
                                    <Text
                                        style={styles.link2}
                                        onPress={() =>
                                            Linking.openURL('https://www.realvistaproperties.com/terms-of-use')
                                        }
                                    >
                                        Terms of Use
                                    </Text>{' '}
                                    and{' '}
                                    <Text
                                        style={styles.link2}
                                        onPress={() =>
                                            Linking.openURL('https://www.realvistaproperties.com/privacy-policy')
                                        }
                                    >
                                        Privacy Policy
                                    </Text>
                                    .
                                </Text>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );

};

export default SignIn;


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 70
    },
    scrollArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'left',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    inputKeyboardVisible: {
        backgroundColor: '#eef',
    },
    button: {
        height: 50,
        backgroundColor: '#FB902E',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginTop: 10,
    },
    buttonText: {
        fontFamily: 'Abel-Regular',
        fontSize: 20,
        color: '#fff',
        fontSize: 18,
        fontWeight: '400',
    },
    googleBtn: {
        borderWidth: 3,
        borderColor: '#FB902E',
        borderRadius: 30,
        padding: 8
    },
    googleBtnImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 214,
        height: 48,
        resizeMode: 'contain',
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerText: {
        color: 'gray',
    },
    link: {
        color: '#358B8B',
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 16,
    },

    text: {
        fontSize: 15,
        color: '#000',
        textAlign: 'center',
    },
    link2: {
        color: '#358B8B',
        textDecorationLine: 'underline',
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
        textAlign: 'center'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    inputp: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
});