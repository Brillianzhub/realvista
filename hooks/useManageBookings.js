import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useManageBookings = (propertyId) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                setError('Authentication token not found.');
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `https://www.realvistamanagement.com/enterprise/property/bookings/${propertyId}`,
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );

            setBookings(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error fetching bookings.');
        } finally {
            setLoading(false);
        }
    }, [propertyId]);

    const confirmPayment = useCallback(
        (bookingId) => {
            Alert.alert(
                "Confirm Payment",
                "Are you sure you want to confirm this payment?",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Confirm",
                        onPress: async () => {
                            try {
                                const token = await AsyncStorage.getItem('authToken');
                                if (!token) {
                                    Alert.alert('Error', 'Authentication token not found.');
                                    return;
                                }

                                await axios.patch(
                                    `https://www.realvistamanagement.com/enterprise/bookings/${bookingId}/confirm-payment/`,
                                    null,
                                    {
                                        headers: { Authorization: `Token ${token}` },
                                    }
                                );

                                Alert.alert('Success', 'Payment confirmed successfully.');
                                fetchBookings();
                            } catch (error) {
                                console.error('Error confirming payment:', error.response?.data || error.message);
                                Alert.alert('Error', error.response?.data?.detail || 'Unable to confirm payment.');
                            }
                        },
                    },
                ]
            );
        },
        [fetchBookings]
    );

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    return { bookings, loading, error, fetchBookings, confirmPayment };
};

export default useManageBookings;
