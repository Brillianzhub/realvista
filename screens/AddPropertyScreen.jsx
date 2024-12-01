import React, { useState } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormField from '../../components/FormField';

const AddPropertyScreen = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        location: '',
        description: '',
        propertyType: '',
        initialCost: '',
        currentValue: '',
        area: ''
    })

    const addProperty = async () => {
        const token = await AsyncStorage.getItem('authToken');

        if (!token) {
            Alert.alert('Error', 'No authentication token found');
            return;
        }


        if (!form.location || !form.description || !form.propertyType || !form.initialCost || !form.currentValue || !form.area) {
            Alert.alert('Error', 'Please fill in all the fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('https://www.realvistamanagement.com/portfolio/properties/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({
                    location: form.location,
                    description: form.description,
                    property_type: form.propertyType,
                    initial_cost: form.initialCost,
                    current_value: form.currentValue,
                    area_sqm: form.area,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create property');
            }

            const result = await response.json();
            Alert.alert('Success', 'Property created successfully');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <FormField
                placeholder="Enter Location"
                value={form.location}
                handleChangeText={(e) => setForm({ ...form, location: e })}
                otherStyles=""
            />
            <FormField
                placeholder="Description"
                value={form.description}
                handleChangeText={(e) => setForm({ ...form, description: e })}
                otherStyles=""
                numberOfLines={4}
            />
            <FormField
                placeholder="Property Type"
                value={form.propertyType}
                handleChangeText={(e) => setForm({ ...form, propertyType: e })}
                otherStyles=""
            />
            <FormField
                placeholder="Initial cost"
                value={form.initialCost}
                handleChangeText={(e) => setForm({ ...form, initialCost: e })}
                otherStyles=""
            />
            <FormField
                placeholder="Current Value"
                value={form.currentValue}
                handleChangeText={(e) => setForm({ ...form, currentValue: e })}
                otherStyles=""
                keyboardType="numeric"
            />
            <FormField
                placeholder="Area (sqm)"
                value={form.area}
                handleChangeText={(e) => setForm({ ...form, area: e })}
                otherStyles=""
                keyboardType="numeric"
            />
            <Button title="Add Property" onPress={addProperty} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
});

export default AddPropertyScreen;
