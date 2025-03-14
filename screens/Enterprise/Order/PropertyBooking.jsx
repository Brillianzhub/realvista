import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, Switch, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '@/context/GlobalProvider';
import { sendNotification } from '@/utils/sendNotifications';
import { formatCurrency } from '@/utils/formatCurrency';
import UserBooking from './UserBooking';


const PropertyBooking = ({ property, tokens, onRefresh, groupId, uniqueGroupId, navigation, closeBottomSheet }) => {
    const { user } = useGlobalContext();
    const [toggle, setToggle] = useState(false);
    const [slots, setSlots] = useState('');
    const [total, setTotal] = useState('0.00');
    const [loading, setLoading] = useState(false);

    const calculateTotal = (slots) => {
        const slotPrice = parseFloat(property.slot_price || '0');
        const totalAmount = slots && !isNaN(slots) ? (parseInt(slots) * slotPrice).toFixed(2) : '0.00';
        setTotal(totalAmount);
    };

    const handleReleasedProperty = () => {
        navigation.navigate('ReleasedSlots', { propertyId: property.id });
    };

    const handleSlotChange = (value) => {
        if (!value || isNaN(value)) {
            setSlots('');
            setTotal('0.00');
            return;
        }

        const parsedValue = parseInt(value);
        if (parsedValue > property.available_slots) {
            Alert.alert('Invalid Input', `You cannot book more than ${property.available_slots} slots.`);
            return;
        }

        setSlots(parsedValue.toString());
        calculateTotal(parsedValue);
    };

    const title = property.title;
    const deviceTokens = tokens;

    const handleBooking = async () => {
        if (!slots || isNaN(slots) || parseInt(slots) <= 0) {
            Alert.alert('Invalid Input', 'Please enter a valid number of slots.');
            return;
        }

        const bookingReference = `RV-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now()}`;
        const messageData = {
            sender: user.name,
            text: `booked ${parseInt(slots)} slots.`,
            senderEmail: user.email,
        };

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert('Error', 'Authentication token is missing.');
                return;
            }

            const response = await axios.post(
                `https://www.realvistamanagement.com/enterprise/groups/${property.id}/book-slot/`,
                {
                    slots_owned: parseInt(slots),
                    user_name: user.name,
                    booking_reference: bookingReference,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            Alert.alert('Success', 'Your slots have been booked successfully.');

            if (deviceTokens && deviceTokens.length > 0) {
                try {
                    await sendNotification({ title, messageData, deviceTokens });
                } catch (notificationError) {
                    console.error('Notification Error:', notificationError);
                    Alert.alert('Notification Failed', 'Booking succeeded, but notification failed to send.');
                }
            } else {
                console.warn('No device tokens available for notification.');
            }

            onRefresh();
            closeBottomSheet();
        } catch (error) {
            console.error('Booking Error:', error);
            Alert.alert(
                'Booking Failed',
                error.response?.data?.error || 'An unexpected error occurred.'
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={styles.detailItem}>
            <UserBooking
                user={user}
                property={property}
                onRefresh={onRefresh}
                groupId={groupId}
                uniqueGroupId={uniqueGroupId}
                tokens={tokens}
            />
            <View style={{}}>
                {property.available_slots > 0 ? (
                    <View style={styles.booking}>
                        <Text style={styles.detailLabel}>BOOK SLOTS</Text>
                        <Switch
                            value={toggle}
                            onValueChange={(value) => setToggle(value)}
                            thumbColor={toggle ? '#FB902E' : '#f4f3f4'}
                            trackColor={{ false: '#9cc9c9', true: '#9cc9c9' }}
                            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                        />
                    </View>
                ) : (
                    <View style={{}}>
                        <Text style={{
                            color: '#721c24',
                            fontSize: 16,
                            marginBottom: 10,
                            fontWeight: '500',
                            textAlign: 'left'
                        }}>
                            You can't book slots again!
                        </Text>

                        <TouchableOpacity
                            onPress={handleReleasedProperty}
                            style={{
                                padding: 8,
                                borderRadius: 8,
                                width: '50%',
                                borderWidth: 1,
                                borderRadius: 8
                            }}
                        >
                            <Text style={{
                                color: '#FB902E',
                                fontSize: 14,
                                fontWeight: '600',
                                textAlign: 'center'
                            }}>
                                SEE RELEASED SLOTS
                            </Text>
                        </TouchableOpacity>
                    </View>

                )}
            </View>
            {toggle && (
                <View style={styles.detailContent}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.bookingValue}>Number of Slots</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={slots}
                            onChangeText={handleSlotChange}
                            placeholder={`Max: ${property.available_slots}`}
                        />
                    </View>

                    <View style={styles.totalContainer}>
                        <Text style={styles.bookingValue}>Total:</Text>
                        <Text style={styles.total}>{formatCurrency(total, property.currency)}</Text>
                    </View>

                    <TouchableOpacity
                        onPress={handleBooking}
                        disabled={loading}
                        style={[
                            {
                                backgroundColor: loading ? '#FB902Eaa' : '#FB902E',
                                padding: 12,
                                borderRadius: 8,
                                alignItems: 'center',
                            },
                        ]}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={{ color: 'white', fontWeight: '600' }}>Submit</Text>
                        )}
                    </TouchableOpacity>

                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    detailItem: {
        marginVertical: 20,
        padding: 15,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
    },
    booking: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    detailContent: {
        marginTop: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: '50%',
    },
    bookingValue: {
        fontSize: 16,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PropertyBooking;
