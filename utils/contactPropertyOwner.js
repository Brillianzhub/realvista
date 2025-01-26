import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert, Linking } from 'react-native';

export const contactPropertyOwner = async ({ selectedItem, user, setIsRecordingInquiry }) => {
    if (!selectedItem || !selectedItem.owner?.email || !user || !user.name || !user.email) {
        Alert.alert('Error', 'Property or user information is missing.');
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

    const ownerEmail = selectedItem.owner.email;
    const propertyName = selectedItem.title;
    const propertyLocation = selectedItem.address;
    const propertyType = selectedItem.property_type;
    const userName = user.name;
    const userEmail = user.email;

    const subject = `Interest in Your Property Listing: ${propertyName}`;
    const body = `Hello,\n\nI am ${userName} (${userEmail}), and I am interested in your property titled "${propertyName}" (${propertyType}) located at ${propertyLocation}. I came across this listing on the Realvista platform and would like to learn more about the property, including any additional details, availability, and pricing.\n\nPlease let me know how I can proceed or reach out for further discussions. Looking forward to your response.\n\nBest regards,\n${userName}`;
    const mailto = `mailto:${ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailto).catch((err) => {
        console.error('An error occurred', err);
        Alert.alert(
            'Error',
            'Unable to open email client. Please ensure you have a mail application installed on your device.'
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
