import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useCurrency } from '../../context/CurrencyContext';
import { formatCurrency } from '../../utils/formatCurrency';
import useManageBookings from '../../hooks/useManageBookings';


const ManageBooking = ({ route }) => {
    const { propertyId } = route.params;
    const { currency } = useCurrency();

    const { bookings, loading, error, confirmPayment } = useManageBookings(propertyId);

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
