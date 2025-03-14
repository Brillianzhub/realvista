import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CoordinateForm from '@/components/Enterprise/GroupCoordinateForm';
import useGroupProperty from '@/hooks/useGroupProperty';

import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const AddPropertyCoordinate = ({ route, navigation }) => {
    const { uniqueGroupId } = route.params;
    const { properties } = useGroupProperty({ uniqueGroupId });
    const { colors } = useTheme();

    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (route.params?.property) {
            setSelectedPropertyId(route.params.property);
        }
    }, [route.params]);


    const handleSubmit = async (payload) => {
        if (!selectedPropertyId) {
            Alert.alert('Error', 'Please select a property before submitting coordinates.');
            return;
        }

        if (!payload.coordinates || payload.coordinates.length === 0) {
            Alert.alert('Error', 'Please add at least one coordinate.');
            return;
        }

        const roundedCoordinates = payload.coordinates.map((coordinate) => {
            if (coordinate.latitude !== undefined && coordinate.longitude !== undefined) {
                return {
                    ...coordinate,
                    latitude: parseFloat(coordinate.latitude.toFixed(6)),
                    longitude: parseFloat(coordinate.longitude.toFixed(6)),
                };
            }
            return coordinate;
        });

        const updatedPayload = {
            ...payload,
            coordinates: roundedCoordinates,
        };

        setIsSubmitting(true);

        try {
            const token = await AsyncStorage.getItem('authToken');

            if (!token) {
                Alert.alert('Error', 'Authentication token is missing. Please log in again.');
                return;
            }

            const response = await axios.post(
                'https://realvistamanagement.com/enterprise/group-property/coordinates/',
                updatedPayload,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            Alert.alert('Success', 'Coordinates saved successfully!');
        } catch (error) {
            console.error('Submission error:', error?.response?.data || error.message);
            Alert.alert('Error', error?.response?.data || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {isSubmitting ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#358B8B" />
                    <Text style={styles.loadingText}>Saving coordinates...</Text>
                </View>
            ) : (
                <>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedPropertyId}
                            onValueChange={(itemValue) => setSelectedPropertyId(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a property" value={null} />
                            {properties.map((property) => (
                                <Picker.Item key={property.id} label={property.title} value={property.id} />
                            ))}
                        </Picker>
                    </View>

                    {selectedPropertyId ? (
                        <CoordinateForm
                            property={{ id: selectedPropertyId }}
                            onSubmit={(payload) => handleSubmit(payload)}
                        />
                    ) : (
                        <Text style={styles.infoText}>Select a property to add coordinates using the dropdown menu above.</Text>
                    )}
                </>
            )}
        </View>
    );
};

export default AddPropertyCoordinate;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
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
        borderWidth: 1,
        borderColor: '#ccc',
    },
    infoText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#358B8B',
    },
});
