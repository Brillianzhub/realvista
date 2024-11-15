import { Alert, Text, TouchableOpacity, View, Pressable, Linking, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, router } from 'expo-router';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { useGlobalContext } from '../../context/GlobalProvider';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { icons } from '../../constants';
import images from '../../constants/images';
// import { usePushNotifications } from '../../usePushNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const signIn = async (email, password) => {
    try {
        // First, sign in the user
        const signInResponse = await fetch('https://brillianzhub.eu.pythonanywhere.com/accounts/signin/', {
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

        // If sign-in is successful, request the token
        const tokenResponse = await fetch('https://brillianzhub.eu.pythonanywhere.com/portfolio/api-token-auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: email, // or 'email' if the endpoint expects email
                password: password,
            }),
        });

        const tokenData = await tokenResponse.json();
        if (!tokenData.token) {
            throw new Error('Authentication token not provided');
        }

        // Store the token
        await AsyncStorage.setItem('authToken', tokenData.token);

        return tokenData;
    } catch (error) {
        console.error('Sign-In Error:', error);
        Alert.alert('Sign-In Error', error.message);
        return null;
    }
};

const SignIn = () => {
    const [error, setError] = useState(null);
    const { setUser, setIsLogged } = useGlobalContext();
    // const { expoPushToken } = usePushNotifications();

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

        // const deviceToken = expoPushToken.data || expoPushToken

        try {
            const result = await signIn(form.email, form.password);
            if (result) {
                setUser({
                    id: result.id,
                    email: result.email,
                    name: result.name,
                    authProvider: 'email'
                });
                setIsLogged(true);
                router.replace('/Home');
            }
        } catch (error) {
            console.error('Login Error:', error);
            Alert.alert('Error', 'Failed to sign in. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // const configureGoogleSignIn = () => {
    //     GoogleSignin.configure({
    //         androidClientId: "1019179928415-t4tno89dijmofiavdibd7oc10skcv2q6.apps.googleusercontent.com",
    //     });
    // };

    // useEffect(() => {
    //     configureGoogleSignIn();
    // }, []);

    // const googleSignIn = async () => {
    //     try {
    //         await GoogleSignin.hasPlayServices();
    //         const googleUserInfo = await GoogleSignin.signIn();

    //         const deviceToken = expoPushToken.data || expoPushToken;

    //         setUser({
    //             id: googleUserInfo.user.id,
    //             email: googleUserInfo.user.email,
    //             name: googleUserInfo.user.name,
    //             authProvider: 'google',
    //         });

    //         setIsLoggedIn(true);
    //         router.replace('/home');

    //         await fetch('https://www.brillianzhub.com/save-google-user/', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 id: googleUserInfo.user.id,
    //                 email: googleUserInfo.user.email,
    //                 name: googleUserInfo.user.name,
    //                 device_token: deviceToken
    //             }),
    //         });
    //     } catch (e) {
    //         Alert.alert('Google Sign-In Error', e.message);
    //     }
    // };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={images.logo}
                    style={styles.logo}
                />
            </View>
            <View style={styles.formContainer}>
                <FormField
                    placeholder="Email"
                    value={form.email}
                    handleChangeText={(e) => setForm({
                        ...form,
                        email: e
                    })}
                    otherStyles="mt-5"
                    keyboardType="email-address"
                />

                <FormField
                    placeholder="Password"
                    value={form.password}
                    handleChangeText={(e) => setForm({
                        ...form,
                        password: e
                    })}
                    otherStyles="mt-3"
                />

                <Link href="/reset-password" style={styles.linkText}>
                    <Text style={styles.forgotPassword}>Forgot your password ?</Text>
                </Link>

                <Pressable style={styles.button} onPress={submit}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
            </View>
            <View style={styles.separatorContainer}>
                <Image
                    source={images.loginpref}
                    style={styles.loginpref}
                />
            </View>
            <View style={styles.googleButtonContainer}>
                <Pressable style={styles.googleButton}>
                    <Image
                        source={images.google}
                    />
                    <Text style={styles.googleButtonText}>Login with Google</Text>
                </Pressable>
                <Pressable style={styles.signUpBtn}>
                    <Link href="/sign-up">
                        <Text style={styles.forgotPassword}>Create new account ?</Text>
                    </Link>
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
    // separator: {
    //     fontSize: 16,
    //     color: '#888',
    // },
    googleButtonContainer: {
        width: '100%',
    },
});
