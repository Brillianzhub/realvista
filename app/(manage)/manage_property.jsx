import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import PropertyForm from '../../components/PropertyForm';

const manage_property = () => {
    const handleFormSubmit = (values) => {
        // Handle form submission, e.g., make an API call
        Alert.alert('Form Submitted', JSON.stringify(values, null, 2));
    };
    return (
        <View>
            <Text>manage_property</Text>
            <PropertyForm onSubmit={handleFormSubmit} />
        </View>
    )
}

export default manage_property

const styles = StyleSheet.create({})