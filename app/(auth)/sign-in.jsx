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
    Keyboard
} from 'react-native';
import images from '../../constants/images';
import { useGlobalContext } from '../../context/GlobalProvider';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import FingerprintAuth from '../../components/FingerprintAuth';




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
    const { setUser, isLogged, setIsLogged } = useGlobalContext();

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    console.log(isLogged)

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


    const { authenticate } = FingerprintAuth({
        onSuccess: fetchUserData,
        onFailure: () => console.log('Fingerprint authentication failed!'),
    });


    const [isSubmitting, setIsSubmitting] = useState(false);

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
                    authProvider: 'email',
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
                                style={[styles.input, keyboardVisible && styles.inputKeyboardVisible]}
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

                            {isLogged ? (
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                                    <Pressable style={[styles.button, { flex: 5 }]} onPress={handleSubmit}>
                                        <Text style={styles.buttonText}>Login</Text>
                                    </Pressable>
                                    <Pressable style={[styles.button, { flex: 1 }]} onPress={authenticate}>
                                        <Image
                                            source={images.fingerprint}
                                        />
                                    </Pressable>
                                </View>
                            ) : (
                                <Pressable style={[styles.button]} onPress={handleSubmit}>
                                    <Text style={styles.buttonText}>Login</Text>
                                </Pressable>
                            )}

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Don't have an account with us ?</Text>
                                <Link href="/sign-up" style={styles.link}>
                                    Sign Up
                                </Link>
                            </View>
                            <View>
                                <Text>Singin with Google</Text>
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
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
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