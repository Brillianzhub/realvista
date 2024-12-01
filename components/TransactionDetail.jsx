import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import images from '../constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const TransactionDetail = ({ selectedItem, closeBottomSheet, refreshData }) => {
    const handlePaymentConfirmation = async () => {
        const token = await AsyncStorage.getItem('authToken');

        if (!token) {
            console.log('Authentication token required');
            return;
        }
        const payload = {
            order_id: selectedItem.id,
        };
        try {
            const response = await axios.post(
                'https://www.realvistamanagement.com/order/update-payment-status/',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                }
            );
            alert(response.data.message);
            if (refreshData) refreshData();
        } catch (error) {
            if (error.response) {
                console.error('Response Error:', error.response.data);
                alert(`Error: ${error.response.data.error || 'Unexpected server error'}`);
            } else {
                console.error('Network Error:', error.message);
                alert('Network error occurred. Please try again.');
            }
        }

    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return formattedDate;
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Transaction Details</Text>
                <TouchableOpacity onPress={closeBottomSheet}>
                    <Ionicons name="close" size={24} color="#358B8B" style={styles.closeIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            {selectedItem && (
                <View style={styles.bottomSheetContent}>
                    <View style={styles.orderHeader}>
                        <View style={styles.transactionsPoint}>
                            <Image
                                source={images.buyOrder}
                                resizeMode='cover'
                            />
                        </View>
                        <Text style={{ fontWeight: "bold", fontSize: 25 }}>Buy Order Created</Text>
                        <Text style={{ fontWeight: "bold", fontSize: 25, color: '#136e8b', marginVertical: 5 }}>${selectedItem.total_amount}</Text>

                        {selectedItem.payment_status === "not_paid" ? (
                            <TouchableOpacity
                                onPress={handlePaymentConfirmation}
                                style={styles.completePaymentBtn}
                            >
                                <Text style={{ fontWeight: "600", color: "white", fontSize: 16 }}>Complete Payment</Text>
                            </TouchableOpacity>
                        ) : null}

                    </View>
                    <View style={styles.overview}>
                        <View style={styles.transactionItem}>
                            <Text style={styles.transactionDetail}>Project</Text>
                            <Text >{selectedItem.project.name}</Text>
                        </View>
                        <View style={styles.transactionItem}>
                            <Text style={styles.transactionDetail}>Order Reference</Text>
                            <Text >{selectedItem.order_reference}</Text>
                        </View>
                        <View style={styles.transactionItem}>
                            <Text style={styles.transactionDetail}>Project Reference</Text>
                            <Text >{selectedItem.project.project_reference}</Text>
                        </View>
                        <View style={styles.transactionItem}>
                            <Text style={styles.transactionDetail}>Slots</Text>
                            <Text >{selectedItem.quantity}</Text>
                        </View>
                        {selectedItem.payment_status === "not_paid" ? (
                            <View style={styles.transactionItem}>
                                <Text style={styles.transactionDetail}>Payment status</Text>
                                <Text>pending</Text>
                            </View>
                        ) : selectedItem.payment_status === "paid" ? (
                            <View style={styles.transactionItem}>
                                <Text style={styles.transactionDetail}>Payment status</Text>

                                <Text >{selectedItem.payment_status}</Text>
                            </View>
                        ) : null}
                        <View style={styles.transactionItem}>
                            <Text style={styles.transactionDetail}>Date created</Text>
                            <Text >{formatDate(selectedItem.created_at)}</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    )
}

export default TransactionDetail

const styles = StyleSheet.create({
    bottomSheetContent: {
        flex: 1,
        padding: 16,
        backgroundColor: '#358B8B1A',
    },
    header: {
        backgroundColor: '#358B8B1A',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        color: '#358B8B',
        fontWeight: 'bold',
    },
    closeIcon: {
        padding: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
    },
    orderHeader: {
        alignItems: "center",
        marginVertical: 40
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    map: {
        width: '100%',
        height: 200,
        marginTop: 20,
        borderRadius: 10,
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    toggleButton: {
        backgroundColor: '#136e8b',
        padding: 10,
        borderRadius: 5,
        width: '50%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    overview: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
    },
    propertyDetailText: {
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'left',
        textDecorationStyle: 'solid',
        textDecorationColor: 'black',
    },
    noMapView: {
        padding: 10
    },
    noMapText: {
        fontSize: 16
    },
    transactionItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10

    },
    transactionsPoint: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: '#358B8B',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },
    transactionDetail: {
        fontSize: 16
    },
    completePaymentBtn: {
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: "#FB902E",
        padding: 12
    }
});
