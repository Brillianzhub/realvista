import { StyleSheet, Text, View, Alert } from 'react-native';
import React, { useState } from 'react';
import useUserProperty from '../../hooks/useUserProperty';
import PropertyUpdateForm from '../../components/PropertyUpdateForm';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import axios from 'axios';


const UpdateProperty = ({ navigation }) => {
    const { properties } = useUserProperty();
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleUpdate = async (values) => {
        const token = await AsyncStorage.getItem('authToken');

        if (!token) {
            Alert.alert('Error', 'Authentication token required!');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `https://www.realvistamanagement.com/portfolio/properties/add/`,
                values,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                }
            );

            Alert.alert('Success', 'Property updated successfully!');
            navigation.goBack();
            return response.data;
        } catch (error) {
            console.error('Error adding property:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to add property. Please try again.');
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
        <View style={styles.container}>
            {isSubmitting ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#358B8B" />
                    <Text style={styles.loadingText}>Wait while we update your data...</Text>
                </View>
            ) : (
                <>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedPropertyId}
                            onValueChange={(itemValue) => setSelectedPropertyId(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a property to update" value={null} />
                            {filteredProperties.map((property) => (
                                <Picker.Item key={property.id} label={property.title} value={property.id} />
                            ))}
                        </Picker>
                    </View>

                    {selectedProperty ? (
                        <PropertyUpdateForm property={selectedProperty} onSubmit={handleUpdate} />
                    ) : (
                        <Text style={styles.infoText}>Select the property for which you'd like to update using the dropdown menu.</Text>
                    )}
                </>
            )}
        </View>
    );
};

export default UpdateProperty;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
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
