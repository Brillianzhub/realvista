import React, { useState } from 'react';
import { View, Alert, StyleSheet, Text } from 'react-native';
import PropertyExpensesForm from '../../components/PropertyExpensesForm';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import useUserProperty from '../../hooks/useUserProperty';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@/context/ThemeContext';


const UserPropertyExpense = ({ navigation }) => {
    const { properties } = useUserProperty();
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { colors } = useTheme();


    const handleFormSubmit = async (values) => {
        const token = await AsyncStorage.getItem('authToken');

        if (!token) {
            Alert.alert('Error', 'Authentication token required!');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `https://www.realvistamanagement.com/portfolio/user-property/add-expense/`,
                values,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                }
            );

            Alert.alert('Success', 'Expenses added successfully!');
            navigation.goBack();
            return response.data;
        } catch (error) {
            console.error('Error adding expenses:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to add expenses. Please try again.');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProperties = properties.filter(
        (property) => property.group_owner_name === null
    );
    const selectedProperty = filteredProperties.find((property) => property.id === selectedPropertyId);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {isSubmitting ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#358B8B" />
                    <Text style={styles.loadingText}>Wait while we add your expenses...</Text>
                </View>
            ) : (
                <>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedPropertyId}
                            onValueChange={(itemValue) => setSelectedPropertyId(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a property to assign expenses" value={null} />
                            {filteredProperties.map((property) => (
                                <Picker.Item key={property.id} label={property.title} value={property.id} />
                            ))}
                        </Picker>
                    </View>

                    {selectedProperty ? (
                        <PropertyExpensesForm property={selectedProperty} onSubmit={handleFormSubmit} />
                    ) : (
                        <Text style={styles.infoText}>Select the property for which you'd like to add expenses using the dropdown menu.</Text>
                    )}
                </>
            )}
        </View>
    );
};

export default UserPropertyExpense;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 10,
        color: '#555',
    },
    pickerContainer: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    infoText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 16,
    },
});
