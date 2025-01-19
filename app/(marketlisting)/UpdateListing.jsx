import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import useFetchUserListedProperties from '../../hooks/useFetchUserListedProperties';
import UpdateListingForm from '../../screens/Market/UpdateListingForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';


const UpdateListing = () => {
    const { property } = useLocalSearchParams();
    const { properties, loading, error } = useFetchUserListedProperties();
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        if (properties && properties.length > 0 && property) {
            const propertyId = Number(property);

            const filteredProperty = properties.find(
                (prop) => prop.id === propertyId
            );

            if (filteredProperty) {
                setSelectedProperty(filteredProperty);
            }
        }
    }, [properties, property]);



    if (loading) {
        return <ActivityIndicator size="large" color="#358B8B" />;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    if (!selectedProperty && !loading) {
        return <Text>Property not found. Please try again later.</Text>;
    }

    const handleSubmit = async (values) => {
        const token = await AsyncStorage.getItem('authToken');

        if (!token) {
            Alert.alert('Error', 'Authentication token required!');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.put(
                `https://www.realvistamanagement.com/market/update-property/`,
                values,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                }
            );

            Alert.alert('Success', 'Property updated successfully!');
            router.replace('/MarketListing');
            return response.data;
        } catch (error) {
            console.error('Error updating property:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to update property. Please try again.');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            {isSubmitting ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#358B8B" />
                    <Text style={[styles.loadingText, { textAlign: 'center' }]}>
                        Wait while we update your property...
                    </Text>
                </View>
            ) : selectedProperty ? (
                <UpdateListingForm property={selectedProperty} onSubmit={handleSubmit} />
            ) : (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>
                    No property selected or found. Please try again.
                </Text>
            )}
        </View>
    );


};

export default UpdateListing;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
