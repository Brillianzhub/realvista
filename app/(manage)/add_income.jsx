import React, { useState } from 'react';
import { View, Alert, StyleSheet, Text } from 'react-native';
import PropertyIncomeForm from '../../components/PropertyIncomeForm';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { router } from 'expo-router';


const AddPropertyIncome = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleFormSubmit = async (values) => {
        const token = await AsyncStorage.getItem('authToken');

        if (!token) {
            Alert.alert('Error', 'Authentication token required!');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `https://www.realvistamanagement.com/portfolio/property/add-income/`,
                values,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                }
            );

            Alert.alert('Success', 'Property added successfully!');

            router.replace('/manage_property');
            return response.data;
        } catch (error) {
            console.error('Error adding property:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to add property. Please try again.');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {isSubmitting ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ActivityIndicator size="large" color="#358B8B" />
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>
                        Wait while we add your income...
                    </Text>
                </View>
            ) : (
                <PropertyIncomeForm onSubmit={handleFormSubmit} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({});

export default AddPropertyIncome;
