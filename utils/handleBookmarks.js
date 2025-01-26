
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';


export const handleAddBookmark = async (propertyId) => {
    try {
        const token = await AsyncStorage.getItem('authToken');

        if (!token) {
            Alert.alert('Error', 'Authentication token is missing.');
            return;
        }

        const response = await axios.post(
            `https://www.realvistamanagement.com/market/bookmark-property/${propertyId}/`,
            {},
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );

        Alert.alert('Success', response.data.message || 'Property successfully added to your wish list.');
    } catch (error) {
        const errorMessage = error.response?.data?.message;

        if (
            error.response?.status === 400 &&
            (errorMessage === "Property is already added to your wish list." ||
                errorMessage === "Property is already bookmarked")
        ) {
            Alert.alert('Info', 'This property is already bookmarked.');
            return;
        }

        console.error('Error bookmarking property:', error.response?.data || error.message);

        if (error.response?.status === 404) {
            Alert.alert('Error', 'The property does not exist.');
        } else {
            Alert.alert(
                'Error',
                error.response?.data?.error || 'An error occurred while bookmarking the property.'
            );
        }
    }
};
