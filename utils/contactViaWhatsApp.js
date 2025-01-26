import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert, Linking } from 'react-native';

export const contactViaWhatsApp = async ({ selectedItem, user, setIsRecordingInquiry }) => {
    if (!selectedItem || !selectedItem.owner?.phone_number || !user || !user.name) {
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
    const propertyName = selectedItem.title;
    const propertyLocation = selectedItem.address;
    const propertyType = selectedItem.property_type;
    const userName = user.name;

    const message = `Hello, I am ${userName}, and I am interested in your property titled "${propertyName}" (${propertyType}) located at ${propertyLocation}. I would like to learn more about the property, including availability and pricing.`;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    Linking.openURL(whatsappURL).catch((err) => {
        console.error('An error occurred', err);
        Alert.alert(
            'Error',
            'Unable to open WhatsApp. Please ensure you have the WhatsApp application installed on your device.'
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
