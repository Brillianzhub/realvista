import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import PropertyForm from '../../components/PropertyForm';

const AddPropertyScreen = () => {
    const handleFormSubmit = (values) => {
        // Handle form submission, e.g., make an API call
        Alert.alert('Form Submitted', JSON.stringify(values, null, 2));
    };
    return (
        <View>
            <PropertyForm onSubmit={handleFormSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({});

export default AddPropertyScreen;
