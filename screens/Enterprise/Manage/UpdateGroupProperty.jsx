import { StyleSheet, Text, View, Alert } from 'react-native';
import React, { useState } from 'react';
import useGroupProperty from '../../../hooks/useGroupProperty';
import UpdateGroupPropertyForm from '../../Enterprise/Manage/UpdateGroupPropertyForm';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import axios from 'axios';


const UpdateProperty = ({ route, navigation }) => {
    const { uniqueGroupId } = route.params;
    const { properties } = useGroupProperty({ uniqueGroupId });
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
            const response = await axios.put( // Use PUT for a full update or PATCH for a partial update
                `https://www.realvistamanagement.com/enterprise/groups/${uniqueGroupId}/${selectedPropertyId}/update/`,
                values,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                }
            );

            Alert.alert('Success', 'Property updated successfully!');

            navigation.navigate('ManageGroupProperty', { uniqueGroupId: uniqueGroupId });
            return response.data;
        } catch (error) {
            console.error('Error updating property:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to update property. Please try again.');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };


    const selectedProperty = properties.find((property) => property.id === selectedPropertyId);

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
                            {properties.map((property) => (
                                <Picker.Item key={property.id} label={property.title} value={property.id} />
                            ))}
                        </Picker>
                    </View>

                    {selectedProperty ? (
                        <UpdateGroupPropertyForm property={selectedProperty} onSubmit={handleUpdate} />
                    ) : (
                        <Text style={styles.infoText}>Please select a property to update.</Text>
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
