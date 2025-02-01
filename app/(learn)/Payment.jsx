import { StyleSheet, Text, View, TouchableOpacity, Image, Linking, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import images from '@/constants/images';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Payment = () => {
    const { courseId } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');

    const initiatePayment = async (method) => {
        setLoading(true);
        setLoadingText(`Please wait, redirecting to ${method}...`);

        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) throw new Error('No authentication token found');

            const response = await axios.post(
                `https://realvistamanagement.com/courses/payment/initiate/${courseId}/`,
                {},
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const { authorization_url } = response.data.data;

            if (authorization_url) {
                Linking.openURL(authorization_url);
            } else {
                Alert.alert('Error', 'Unable to initiate payment. Please try again.');
            }
        } catch (error) {
            console.error(`Error initiating ${method} payment:`, error);
            Alert.alert('Error', `An error occurred while initiating ${method} payment. Please try again.`);
        } finally {
            setLoading(false);
            setLoadingText('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Payment Method</Text>

            <TouchableOpacity
                style={[styles.button, loading && styles.disabledButton]}
                onPress={() => initiatePayment('Paystack')}
                disabled={loading}
            >
                <Image source={images.paystack} style={styles.icon} />
                <Text style={styles.buttonText}>Pay with Paystack</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, loading && styles.disabledButton]}
                onPress={() => initiatePayment('PayPal')}
                disabled={loading}
            >
                <Image source={images.paypal} style={styles.icon} />
                <Text style={styles.buttonText}>Pay with PayPal</Text>
            </TouchableOpacity>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>{loadingText}</Text>
                </View>
            )}
        </View>
    );
};

export default Payment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        padding: 15,
        borderRadius: 10,
        width: '90%',
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
        color: '#333',
    },
    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    loadingContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 14,
        marginTop: 10,
        color: '#333',
    },
});
