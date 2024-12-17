import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    ScrollView,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Keyboard,
    Alert,
    Image,
    Linking
} from 'react-native';
import images from '../../constants/images';
import { useGlobalContext } from '../../context/GlobalProvider';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const RegistrationForm = () => {
    const { setUser, setIsLogged } = useGlobalContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);


    const validateForm = (form) => {
        const { email, password, confirmPassword } = form;

        // Regular expression for validating email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validate email
        if (!email || !emailRegex.test(email)) {
            return { valid: false, message: "Please enter a valid email address." };
        }

        // Validate password length
        if (!password || password.length < 8) {
            return { valid: false, message: "Password must be at least 8 characters long." };
        }

        // Validate password and confirm password match
        if (password !== confirmPassword) {
            return { valid: false, message: "Password and confirm password must match." };
        }

        // All validations passed
        return { valid: true };
    };


    const handleSubmit = async () => {
        const validation = validateForm(form);

        if (!validation.valid) {
            alert(validation.message);
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

            router.replace('/verify-email');
        } catch (error) {
            Alert.alert('Error', error.message);
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
                            <Text style={styles.loadingText}>Registering...</Text>
                        </View>
                    )}
                    {!isSubmitting && (
                        <>
                            <View style={styles.logoContainer}>
                                <Image source={images.logo} style={styles.logo} />
                            </View>
                            <TextInput
                                style={[styles.input, keyboardVisible && styles.inputKeyboardVisible]}
                                placeholder="Full Name"
                                value={form.name}
                                onChangeText={(e) => setForm({ ...form, name: e })}
                            />
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

                            {/* Confirm Password Field */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputp}
                                    placeholder="Confirm Password"
                                    secureTextEntry={!showConfirmPassword}
                                    value={form.confirmPassword}
                                    onChangeText={(e) => setForm({ ...form, confirmPassword: e })}
                                />
                                <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <Ionicons
                                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                                        size={24}
                                        color="gray"
                                    />
                                </Pressable>
                            </View>
                            <Pressable style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Register</Text>
                            </Pressable>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Have an account already?</Text>
                                <Link href="/sign-in" style={styles.link}>
                                    Sign In
                                </Link>
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
        // padding: 10,
    },
});

export default RegistrationForm;




// const SignUp = () => {
//     const { setUser, setIsLogged } = useGlobalContext();
//     const [isSubmitting, setIsSubmitting] = useState(false);


//     const [form, setForm] = useState({
//         name: '',
//         email: '',
//         password: ''
//     });

//     const submit = async () => {
//         if (!form.name || !form.email || !form.password) {
//             Alert.alert('Error', 'Please fill in all the fields');
//             return;
//         }

//         setIsSubmitting(true);

//         try {
//             const response = await fetch('https://www.realvistamanagement.com/accounts/register_user/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     name: form.name,
//                     email: form.email,
//                     password: form.password,
//                     auth_provider: 'email'
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to sign up');
//             }

//             const result = await response.json();

//             const tokenResponse = await fetch('https://www.realvistamanagement.com/portfolio/api-token-auth/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     username: form.email,
//                     password: form.password,
//                 }),
//             });

//             const tokenData = await tokenResponse.json();

//             if (!tokenData.token) {
//                 throw new Error('Authentication token not provided');
//             }

//             await AsyncStorage.setItem('authToken', tokenData.token);


//             setUser({
//                 id: result.id,
//                 email: result.email,
//                 name: result.name,
//                 authProvider: 'email'
//             });
//             setIsLogged(true);

//             router.replace('/verify-email');
//         } catch (error) {
//             Alert.alert('Error', error.message);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };


//     return (
//         // justifyContent: 'center',
//         <SafeAreaView style={styles.safeArea}>
//             <ScrollView
//                 // contentContainerStyle={styles.scrollViewContent}
//                 keyboardShouldPersistTaps="handled"
//             >
//                 <View style={styles.container}>
//                     {isSubmitting && (
//                         <View style={styles.loadingOverlay}>
//                             <ActivityIndicator size="large" color="#358B8B" />
//                             <Text style={styles.loadingText}>Registering...</Text>
//                         </View>
//                     )}
//                     {!isSubmitting && (
//                         <>
//                             <View style={styles.logoContainer}>
//                                 <Image source={images.logo} style={styles.logo} />
//                             </View>
//                             <View style={styles.formContainer}>
//                                 <FormField
//                                     placeholder="Enter your first and last name"
//                                     title="Full Name"
//                                     value={form.name}
//                                     handleChangeText={(e) => setForm({ ...form, name: e })}
//                                     otherStyles=""
//                                 />
//                                 <FormField
//                                     placeholder="Enter your email"
//                                     title="E-mail"
//                                     value={form.email}
//                                     handleChangeText={(e) => setForm({ ...form, email: e })}
//                                     otherStyles="mt-3"
//                                     keyboardType="email-address"
//                                 />
//                                 <FormField
//                                     placeholder="********"
//                                     title="Password"
//                                     value={form.password}
//                                     handleChangeText={(e) => setForm({ ...form, password: e })}
//                                     otherStyles="mt-5"
//                                     secureTextEntry
//                                 />
//                                 <FormField
//                                     placeholder="*********"
//                                     title="Confirm Password"
//                                     value={form.confirmPassword}
//                                     handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
//                                     otherStyles="mt-5"
//                                     secureTextEntry
//                                 />
//                                 <Pressable style={styles.button} onPress={submit}>
//                                     <Text style={styles.buttonText}>Register</Text>
//                                 </Pressable>
//                                 <View style={styles.footer}>
//                                     <Text style={styles.footerText}>Have an account already?</Text>
//                                     <Link href="/sign-in" style={styles.link}>
//                                         Sign In
//                                     </Link>
//                                 </View>
//                                 <View style={{ marginVertical: 10 }}>
//                                     <Text style={styles.text}>
//                                         By continuing, you agree to our{' '}
//                                         <Text
//                                             style={styles.link2}
//                                             onPress={() =>
//                                                 Linking.openURL('https://www.realvistaproperties.com/terms-of-use')
//                                             }
//                                         >
//                                             Terms of Use
//                                         </Text>{' '}
//                                         and{' '}
//                                         <Text
//                                             style={styles.link2}
//                                             onPress={() =>
//                                                 Linking.openURL('https://www.realvistaproperties.com/privacy-policy')
//                                             }
//                                         >
//                                             Privacy Policy
//                                         </Text>
//                                         .
//                                     </Text>
//                                 </View>
//                             </View>
//                         </>
//                     )}
//                 </View>
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     container: {
//         // width: '100%',
//         // alignItems: 'center',
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         // padding: 20,
//         // backgroundColor: '#f9f9f9',
//     },
//     formContainer: {
//         width: '100%',
//         // maxWidth: 400,
//         // alignSelf: 'center',
//     },
//     logoContainer: {
//         alignItems: 'center',
//         marginBottom: 40,
//     },
//     logo: {
//         width: 214,
//         height: 48,
//         resizeMode: 'contain',
//     },
//     footer: {
//         marginTop: 20,
//         alignItems: 'center',
//     },
//     footerText: {
//         color: 'gray',
//     },
//     link: {
//         color: '#358B8B',
//         textAlign: 'center',
//         marginVertical: 10,
//         fontSize: 16,
//     },
//     button: {
//         width: '100%',
//         height: 50,
//         backgroundColor: '#FB902E',
//         borderRadius: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     loadingContainer: {
//         flex: 1,
//         width: '100%',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.1)',
//     },
//     loadingText: {
//         marginTop: 10,
//         fontSize: 16,
//         color: '#000',
//     },
//     buttonDisabled: {
//         backgroundColor: '#ccc',
//     },
//     text: {
//         fontSize: 15,
//         color: '#000',
//         textAlign: 'center',
//     },
//     link2: {
//         color: '#358B8B',
//         textDecorationLine: 'underline',
//     },

// });

// export default SignUp;
