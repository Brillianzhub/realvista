import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import useManageBookings from '@/hooks/useManageBookings';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { TouchableOpacity } from 'react-native';
import { formatCurrency } from '../../../utils/formatCurrency';
import TransferSlotsModal from './TransferSlotsModal';
import ReleaseSlotsModal from './ReleaseSlotsModal';

const UserBooking = ({ property, user, onRefresh, groupId, uniqueGroupId }) => {
    const { bookings } = useManageBookings(property.id);
    const [membersEmails, setMembersEmails] = useState([]);
    const [processingBookingId, setProcessingBookingId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [releaseSlotsModalVisible, setReleaseSlotsModalVisible] = useState(false);

    const [selectedBookingIds, setSelectedBookingIds] = useState([]);
    const [loading, setLoading] = useState(false);

    const userBookings = bookings.filter(
        booking => booking.user === user.email && booking.status !== 'cancelled'
    );

    const totalUserSlots = userBookings.reduce((sum, booking) => sum + booking.slots_owned, 0);

    const groupedBookings = userBookings.reduce((acc, booking) => {
        if (!acc[booking.status]) {
            acc[booking.status] = { slots: 0, totalCost: 0, property: booking.property, ids: [] };
        }
        acc[booking.status].slots += booking.slots_owned;
        acc[booking.status].totalCost += parseFloat(booking.total_cost);
        acc[booking.status].ids.push(booking.id);
        return acc;
    }, {});

    const fetchGroupMembers = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.get(`https://www.realvistamanagement.com/enterprise/groups/${groupId}/members`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            // setMembers(response.data);

            const emails = response.data.map(member => member.email);
            setMembersEmails(emails);
        } catch (error) {
            console.error('Error fetching group members:', error);
            Alert.alert('Error', 'Failed to fetch group members.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupMembers();
    }, []);


    const handleCancel = async (bookingIds) => {
        setProcessingBookingId(bookingIds[0]);
        try {
            const token = await AsyncStorage.getItem('authToken');
            await Promise.all(
                bookingIds.map(id =>
                    axios.post(
                        `https://realvistamanagement.com/enterprise/cancel-booking/${id}/`,
                        {},
                        { headers: { Authorization: `Token ${token}` } }
                    )
                )
            );

            Alert.alert("Success", "Booking cancelled successfully.");
            onRefresh();
        } catch (error) {
            console.error("Cancellation failed:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to cancel booking.");
        } finally {
            setProcessingBookingId(null);
        }
    };

    const handleTransfer = (bookingIds) => {
        setSelectedBookingIds(bookingIds);
        setModalVisible(true);
    };

    const handleRelease = async (bookingIds) => {
        setSelectedBookingIds(bookingIds);
        setReleaseSlotsModalVisible(true);
    };

    return (
        <ScrollView style={styles.container}>
            {Object.keys(groupedBookings).length === 0 ? (
                <Text>No active bookings found.</Text>
            ) : (
                Object.keys(groupedBookings).map((status) => (
                    <View key={status} style={styles.statusContainer}>
                        <Text style={styles.statusTitle}>
                            {status.toUpperCase()} SLOTS
                        </Text>
                        <View style={styles.bookingCard}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.label}>Slots:</Text>
                                <Text style={styles.value}>{groupedBookings[status].slots}</Text>
                            </View>
                            <View style={styles.rowBetween}>
                                <Text style={styles.label}>Total Cost:</Text>
                                <Text style={styles.value}>{formatCurrency(groupedBookings[status].totalCost, property.currency)}</Text>
                            </View>
                            <View style={styles.rowBetween}>
                                <Text style={styles.label}>Status:</Text>
                                <Text style={styles.value}>{status}</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                {status === 'booked' ? (
                                    <>
                                        <TouchableOpacity
                                            onPress={() => handleTransfer(groupedBookings[status].ids)}
                                            style={[styles.button, { backgroundColor: '#FB902E' }]}
                                            disabled={processingBookingId === groupedBookings[status].ids[0]}
                                        >
                                            {processingBookingId === groupedBookings[status].ids[0] ? (
                                                <ActivityIndicator color="white" />
                                            ) : (
                                                <Text style={{ color: 'white', fontWeight: '600' }}>Transfer</Text>
                                            )}
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleRelease(groupedBookings[status].ids)}
                                            style={[styles.button, { borderWidth: 1, backgroundColor: 'white' }]}
                                            disabled={processingBookingId === groupedBookings[status].ids[0]}
                                        >
                                            {processingBookingId === groupedBookings[status].ids[0] ? (
                                                <ActivityIndicator color="#FB902E" />
                                            ) : (
                                                <Text style={{ color: '#FB902E', fontWeight: '600' }}>Release</Text>
                                            )}
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => handleCancel(groupedBookings[status].ids)}
                                        style={[styles.button, { backgroundColor: '#FB902E' }]}
                                        disabled={processingBookingId === groupedBookings[status].ids[0]}
                                    >
                                        {processingBookingId === groupedBookings[status].ids[0] ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <Text style={{ color: 'white', fontWeight: '600' }}>Cancel</Text>
                                        )}
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                ))
            )}

            <TransferSlotsModal
                visible={modalVisible}
                allocationIds={selectedBookingIds}
                onClose={() => setModalVisible(false)}
                onRefresh={onRefresh}
                totalUserSlots={totalUserSlots}
                members={membersEmails}
            />

            <ReleaseSlotsModal
                visible={releaseSlotsModalVisible}
                allocationIds={selectedBookingIds}
                onClose={() => setReleaseSlotsModalVisible(false)}
                onRefresh={onRefresh}
                totalUserSlots={totalUserSlots}
                members={membersEmails}
                uniqueGroupId={uniqueGroupId}
                groupId={groupId}
                property={property}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    statusContainer: {
        marginBottom: 20,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#555',
    },
    bookingCard: {
        marginBottom: 10,
    },
    propertyName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        borderColor: '#FB902E',
        borderWidth: 1,
        borderRadius: 8,
        marginRight: 10,
        padding: 10,
        alignItems: 'center',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    label: {
        fontWeight: '600',
        color: '#333',
    },
    value: {
        color: '#555',
        fontWeight: '500',
    },
});

export default UserBooking;