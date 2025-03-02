import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


export const googleAuthSignIn = async ({ setUser, setIsLogged, router }) => {
    try {
        await GoogleSignin.hasPlayServices();
        const googleUserInfo = await GoogleSignin.signIn();

        const { email, id, name, familyName, givenName } = googleUserInfo.data.user;

        const fullName = name || givenName || '';
        const firstName = givenName || familyName || fullName.split(" ")[0];
        const lastName = familyName || fullName.split(" ")[1] || '';

        const response = await fetch('https://www.realvistamanagement.com/accounts/register_google_user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: lastName,
                first_name: firstName,
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

        const userResponse = await fetch('https://www.realvistamanagement.com/accounts/current-user/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${result.token}`,
            },
        });

        if (!userResponse.ok) {
            const errorData = await userResponse.json();
            throw new Error(errorData.error || 'Failed to fetch user details');
        }

        const userData = await userResponse.json();

        setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            authProvider: 'google',
            isActive: userData.is_active,
            isStaff: userData.is_staff,
            profile: userData.profile,
            groups: userData.groups,
            preference: userData.preference,
            subscription: userData.subscription,
            referral_code: userData.referral_code,
            referrer: userData.referrer,
            referred_users_count: userData.referred_users_count,
            total_referral_earnings: userData.total_referral_earnings,
            groups: userData.groups,
        });

        setIsLogged(true);
        router.replace('/HomeScreen');
    } catch (error) {
        Alert.alert('Google Sign-In Error', error.message);
    }
};
