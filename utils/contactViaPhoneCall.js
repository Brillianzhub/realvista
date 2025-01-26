import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert, Linking } from 'react-native';

export const contactViaPhoneCall = async ({ selectedItem, user, setIsRecordingInquiry }) => {
    if (!selectedItem || !selectedItem.owner?.phone_number || !user) {
        Alert.alert('Error', 'Phone number or user information is missing.');
        return;
    }

    setIsRecordingInquiry?.(true);

    try {
        await recordInquiry(selectedItem.id);
    } catch (error) {
        console.error('Error recording inquiry:', error.response?.data || error.message);
        Alert.alert('Error', 'Unable to record inquiry. Please try again.');
        setIsRecordingInquiry?.(false);
        return;
    }

    setIsRecordingInquiry?.(false);

    const phoneNumber = selectedItem.owner.phone_number;
    const telURL = `tel:${phoneNumber}`;

    Linking.openURL(telURL).catch((err) => {
        console.error('An error occurred', err);
        Alert.alert(
            'Error',
            'Unable to make the call. Please ensure your device supports phone calls and try again.'
        );
    });
};

const recordInquiry = async (propertyId) => {
    try {
        const token = await AsyncStorage.getItem('authToken');

        if (!token) {
            Alert.alert('Error', 'Authentication token is missing.');
            return;
        }

        await axios.get(
            `https://www.realvistamanagement.com/market/inquiry-on-property/${propertyId}/`,
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );
    } catch (error) {
        console.error(
            'Error recording inquiry:',
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.detail || 'An error occurred while recording the inquiry.'
        );
    }
};
