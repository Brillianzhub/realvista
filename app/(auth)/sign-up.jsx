import { Text, View, Alert, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import FormField from '../../components/FormField';
import { useGlobalContext } from '../../context/GlobalProvider';
import images from '../../constants/images';
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';

const SignUp = () => {
    const { setUser, setIsLogged } = useGlobalContext();
    const [isSubmitting, setIsSubmitting] = useState(false);


    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });


    const submit = async () => {
        if (!form.name || !form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all the fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('https://www.realvistamanagement.com/accounts/register_user/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    auth_provider: 'email'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to sign up');
            }

            const result = await response.json();

            const tokenResponse = await fetch('https://www.realvistamanagement.com/portfolio/api-token-auth/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: form.email,
                    password: form.password,
                }),
            });

            const tokenData = await tokenResponse.json();

            if (!tokenData.token) {
                throw new Error('Authentication token not provided');
            }

            await AsyncStorage.setItem('authToken', tokenData.token);


            setUser({
                id: result.id,
                email: result.email,
                name: result.name,
                authProvider: 'email'
            });
            setIsLogged(true);

            router.replace('/Home');
        } catch (error) {
            Alert.alert('Error', error.message);
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
                        <Image
                            source={images.logo}
                            style={styles.logo}
                        />
                    </View>
                    <View style={styles.formContainer}>
                        <FormField
                            placeholder="Fullname"
                            value={form.name}
                            handleChangeText={(e) => setForm({ ...form, name: e })}
                            otherStyles=""
                        />
                        <FormField
                            placeholder="Email"
                            value={form.email}
                            handleChangeText={(e) => setForm({ ...form, email: e })}
                            otherStyles="mt-3"
                            keyboardType="email-address"
                        />
                        <FormField
                            placeholder="Password"
                            value={form.password}
                            handleChangeText={(e) => setForm({ ...form, password: e })}
                            otherStyles="mt-5"
                        />
                        <Pressable style={styles.button} onPress={submit}>
                            <Text style={styles.buttonText}>Register</Text>
                        </Pressable>
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Have an account already?
                            </Text>
                            <Link href="/sign-in" style={styles.link}>
                                Sign In
                            </Link>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
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
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#FB902E',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
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

};

export default SignUp;
