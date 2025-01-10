import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import useManageBookings from '../../hooks/useManageBookings';

const ManageAllocation = ({ property }) => {
    const { bookings, loading, error, confirmPayment } = useManageBookings(property.id);
    const allocatedSlots = bookings.reduce((sum, booking) => sum + booking.slots_owned, 0);
    const remainingSlots = property.total_slots - allocatedSlots;

    const renderBooking = ({ item }) => (
        <View style={styles.bookingItem}>
            <Text style={styles.propertyName}>Property: {item.property}</Text>
            <View style={styles.slotItems}>
                <Text>User</Text>
                <Text style={{ color: '#FB902E' }}>{item.user}</Text>
            </View>
            <View style={styles.slotItems}>
                <Text>Slots Owned</Text>
                <Text style={{ color: '#FB902E' }}>{item.slots_owned}</Text>
            </View>
            <View style={styles.slotItems}>
                <Text>Total Cost</Text>
                <Text style={{ color: '#FB902E' }}>{formatCurrency(item.total_cost, property.currency)}</Text>
            </View>
            <View style={styles.slotItems}>
                <Text>Payment Status</Text>
                <Text style={{ color: '#FB902E' }}>{item.status}</Text>
            </View>

            {item.status === "pending" && (

                <TouchableOpacity
                    onPress={() => confirmPayment(item.id)}
                    style={styles.confirmPaymentBtn}
                >
                    <Text style={{ color: 'white' }}>Confirm Payment</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    if (loading) {
        return <Text>Loading bookings...</Text>;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.slotItems}>
                <Text style={styles.title}>Total Slots</Text>
                <Text style={styles.title}>{property.total_slots}</Text>
            </View>

            <View style={styles.slotItems}>
                <Text style={styles.title}>Allocated Slots</Text>
                <Text style={styles.title}>{allocatedSlots}</Text>
            </View>

            <View style={styles.slotItems}>
                <Text style={styles.title}>Remaining Slots</Text>
                <Text style={styles.title}>{remainingSlots}</Text>
            </View>
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderBooking}
                ListEmptyComponent={<Text>No bookings available.</Text>}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default ManageAllocation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    bookingItem: {
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
    },
    propertyName: {
        fontWeight: "bold",
    },
    confirmPaymentBtn: {
        marginTop: 20,
        backgroundColor: '#FB902E',
        padding: 10,
        borderRadius: 30,
        alignItems: 'center'
    },
    slotItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});
