import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import useUserProperty from '../../hooks/useUserProperty';
import ListingForm from '../../screens/Market/ListingForm';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import uploadImageUrls from '@/hooks/uploadImageUrls';
import { useGlobalContext } from '@/context/GlobalProvider';

const AddListing = () => {
    const { properties } = useUserProperty();
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFormWithoutProperty, setShowFormWithoutProperty] = useState(false);
    const filteredProperties = properties.filter((property) => property.group_owner_name === null);
    const selectedProperty = filteredProperties.find((property) => property.id === selectedPropertyId);
    const { user } = useGlobalContext();

    useEffect(() => {
        checkMandatoryProfileFields();
    }, []);

    const checkMandatoryProfileFields = () => {
        if (!user.profile) {
            Alert.alert(
                'Profile Incomplete',
                'Before you can list a property, please complete your profile information.',
                [
                    {
                        text: 'Go to Profile',
                        onPress: () => router.push('/(auth)/update-profile'),
                    },
                    {
                        text: 'Cancel',
                        onPress: () => router.push('/(tabs)/HomeScreen'),
                    },
                ]
            );
            return;
        }

        const mandatoryFields = ['city', 'country_of_residence', 'phone_number', 'street'];
        const missingFields = mandatoryFields.filter(field => !user.profile[field]);

        if (missingFields.length > 0) {
            Alert.alert(
                'Profile Incomplete',
                `Before you can list a property, please complete the mandatory fields in your profile. This information is essential for potential buyers or renters to contact you.`,
                [
                    {
                        text: 'Go to Profile',
                        onPress: () => router.push('/(auth)/update-profile'),
                    },
                    {
                        text: 'Cancel',
                        onPress: () => router.push('/(tabs)/HomeScreen'),
                    },
                ]
            );
        }
    };


    const handleContinueWithoutProperty = () => {
        checkMandatoryProfileFields();
        setShowFormWithoutProperty(true);
    };

    const handleSubmit = async (values) => {
        const token = await AsyncStorage.getItem('authToken');

        if (!token) {
            Alert.alert('Error', 'Authentication token required!');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `https://www.realvistamanagement.com/market/list-property/`,
                values,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                }
            );

            const updatedProperty = response.data;

            const propertyId = updatedProperty.data.id;
            if (!propertyId) {
                throw new Error('Property ID is missing in the response');
            }

            const imageUrls = selectedProperty?.images?.map((item) => item.image).filter(Boolean) || [];

            if (imageUrls.length > 0) {
                await uploadImageUrls(token, propertyId, imageUrls);
                Alert.alert('Success', 'Property and images updated successfully!');
            } else {
                Alert.alert('Success', 'Property updated successfully without images!');
            }

            router.push({
                pathname: '/MarketFeatures',
                params: { property: propertyId },
            });

            return updatedProperty;
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
                    <Text style={styles.loadingText}>Wait while we list your property...</Text>
                </View>
            ) : (
                <>
                    {!showFormWithoutProperty && (
                        <>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedPropertyId}
                                    onValueChange={(itemValue) => setSelectedPropertyId(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select a property to list" value={null} />
                                    {filteredProperties.map((property) => (
                                        <Picker.Item key={property.id} label={property.title} value={property.id} />
                                    ))}
                                </Picker>
                            </View>

                            {!selectedProperty && (
                                <View>
                                    <Text style={styles.infoText}>
                                        Use the dropdown menu to select the property you'd like to list.
                                    </Text>
                                    <Text style={styles.infoText}>OR</Text>
                                    <TouchableOpacity onPress={handleContinueWithoutProperty}>
                                        <Text style={[styles.infoText, styles.linkText]}>
                                            Click here to Continue
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    )}

                    {(selectedProperty || showFormWithoutProperty) && (
                        <ListingForm
                            property={selectedProperty || {}}
                            onSubmit={handleSubmit}
                        />
                    )}
                </>
            )}
        </View>
    );
};

export default AddListing;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
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
    linkText: {
        color: '#358B8B',
        textDecorationLine: 'underline',
    },
});