import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '../../context/GlobalProvider';
import { sendNotification } from '../../utils/sendNotifications';


const PropertyBooking = ({ property, tokens, onRefresh, closeBottomSheet }) => {
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
    
            // Make the booking request
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
    
            // Send notification
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
                        <Text style={styles.total}>{`₦${total}`}</Text>
                    </View>

                    <Button
                        title={loading ? 'Booking...' : 'Submit'}
                        onPress={handleBooking}
                        color="#FB902E"
                        disabled={loading}
                    />
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
        backgroundColor: '#f9f9f9',
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
