import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCurrency } from '../../context/CurrencyContext';
import { formatCurrency } from '../../utils/formatCurrency';

const ManageBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currency } = useCurrency();

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                setError('Authentication token not found.');
                setLoading(false);
                return;
            }

            const response = await axios.get('https://www.realvistamanagement.com/enterprise/property/bookings/', {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            setBookings(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error fetching bookings.');
        } finally {
            setLoading(false);
        }
    };

    const confirmPayment = async (bookingId) => {
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
                                    headers: {
                                        Authorization: `Token ${token}`,
                                    },
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
    };


    useEffect(() => {
        fetchBookings();
    }, []);

    const renderBookingItem = ({ item }) => (
        <View style={styles.bookingItem}>
            <Text style={styles.propertyTitle}>{item.property}</Text>
            <Text style={styles.bookingDetails}>
                User: {item.user} | Slots: {item.slots_owned}
            </Text>
            <Text style={styles.bookingDetails}>
                Total Cost: {formatCurrency(item.total_cost, currency)} | Payment Status: {item.status === 'booked' ? 'Paid' : 'Pending'}
            </Text>
            <Text style={styles.date}>Created At: {new Date(item.created_at).toLocaleString()}</Text>
            {item.status === 'pending' && (
                <TouchableOpacity
                    onPress={() => confirmPayment(item.id)}
                    style={styles.confirmPayment}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Confirm Payment</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Manage Bookings</Text>
            {loading && <ActivityIndicator size="large" color="#358B8B" />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {!loading && !error && (
                <FlatList
                    data={bookings}
                    renderItem={renderBookingItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text style={styles.emptyText}>No bookings found.</Text>}
                />
            )}
        </View>
    );
};

export default ManageBooking;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    bookingItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 3,
    },
    propertyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#358B8B',
        marginBottom: 5,
    },
    bookingDetails: {
        fontSize: 14,
        color: '#555',
    },
    date: {
        fontSize: 12,
        color: '#777',
        marginTop: 5,
    },
    listContainer: {
        paddingBottom: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
    errorText: {
        fontSize: 14,
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
    confirmPayment: {
        backgroundColor: '#FB902E',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 12,
    }
});
