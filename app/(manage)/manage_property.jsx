import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateProperty = () => {
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [initialCost, setInitialCost] = useState('');
    const [currentValue, setCurrentValue] = useState('');
    const [area, setArea] = useState('');

    const addProperty = async () => {
        const token = await AsyncStorage.getItem('authToken');

        console.log(`Token ${token}`)

        if (!token) {
            Alert.alert('Error', 'No authentication token found');
            return;
        }

        try {
            const response = await fetch('http://192.168.0.57:8000/properties/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({
                    location,
                    description,
                    property_type: propertyType,
                    initial_cost: initialCost,
                    current_value: currentValue,
                    area_sqm: area,
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
            <Text style={styles.label}>Location:</Text>
            <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
            />
            <Text style={styles.label}>Description:</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
            />
            <Text style={styles.label}>Property Type:</Text>
            <TextInput
                style={styles.input}
                value={propertyType}
                onChangeText={setPropertyType}
            />
            <Text style={styles.label}>Initial Cost:</Text>
            <TextInput
                style={styles.input}
                value={initialCost}
                onChangeText={setInitialCost}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Current Value:</Text>
            <TextInput
                style={styles.input}
                value={currentValue}
                onChangeText={setCurrentValue}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Area (sqm):</Text>
            <TextInput
                style={styles.input}
                value={area}
                onChangeText={setArea}
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

export default CreateProperty;
