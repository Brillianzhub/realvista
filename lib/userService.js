import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCurrentUser = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');

        if (!token) {
            throw new Error('No token found in AsyncStorage');
        }

        const response = await fetch('https://brillianzhub.eu.pythonanywhere.com/accounts/current-user/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch current user. Status: ${response.status}`);
        }

        const userData = await response.json();

        return userData;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
};
