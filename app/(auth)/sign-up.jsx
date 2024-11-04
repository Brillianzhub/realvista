import { TouchableOpacity, Linking, Text, View, Alert, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { useGlobalContext } from '../../context/GlobalProvider';
import images from '../../constants/images';
import { Link, router } from 'expo-router';

const SignUp = () => {
    const { setUser, setIsLogged } = useGlobalContext();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async () => {
        if (!form.name || !form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all the fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('http://192.168.0.57:8000/accounts/register_user/', {
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

            setUser({
                id: result.id,
                email: result.email,
                name: result.name,
                authProvider: 'email'
            });
            setIsLogged(true);

            router.replace('/home');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // python manage.py runserver 0.0.0.0:8000

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
                    title="Fullname"
                    value={form.name}
                    handleChangeText={(e) => setForm({ ...form, name: e })}
                    otherStyles=""
                />

                <FormField
                    title="Email"
                    value={form.email}
                    handleChangeText={(e) => setForm({ ...form, email: e })}
                    otherStyles="mt-3"
                    keyboardType="email-address"
                />
                <FormField
                    title="Password"
                    value={form.password}
                    handleChangeText={(e) => setForm({ ...form, password: e })}
                    otherStyles="mt-5"
                />
                <Pressable style={styles.button} onPress={submit}>
                    <Text style={styles.buttonText}>Login</Text>
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
};

export default SignUp;
