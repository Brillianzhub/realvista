import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


export const googleAuthSignIn = async ({ setUser, setIsLogged, router }) => {

    try {
        await GoogleSignin.hasPlayServices();
        const googleUserInfo = await GoogleSignin.signIn();

        const { email, id, name } = googleUserInfo.data.user;

        const response = await fetch('https://www.realvistamanagement.com/accounts/register_google_user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                google_id: id,
                auth_provider: 'google',
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to register with Google");
        }

        const result = await response.json();

        await AsyncStorage.setItem('authToken', result.token);

        setUser({
            id: result.id,
            email: result.email,
            name: result.name,
            authProvider: 'google',
        });

        setIsLogged(true);

        router.replace('/HomeScreen');
    } catch (error) {
        Alert.alert('Google Sign-In Error', error.message);
    }
};
