import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import { Button, HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import useUserProperty from '../../hooks/useUserProperty';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const RemoveProperty = () => {
    const { properties, fetchUserProperties, isLoading } = useUserProperty();
    const [selectedProperty, setSelectedProperty] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDeleteProperty = async () => {
        if (!selectedProperty) {
            Alert.alert('Error', 'Please select a property to delete.');
            return;
        }

        const token = await AsyncStorage.getItem('authToken');

        if (!token) {
            Alert.alert('Error', 'User token required to complete this operation');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `https://www.realvistamanagement.com/portfolio/delete-property/${selectedProperty}/`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                }
            );

            if (response.ok) {
                Alert.alert('Success', 'Property has been deleted successfully.');
                setSelectedProperty('');
                fetchUserProperties();
                router.replace('/manage_property');
            } else {
                const error = await response.json();
                Alert.alert('Error', error.error || 'Failed to delete property.');
            }
        } catch (error) {
            console.error('Error deleting property:', error);
            Alert.alert('Error', 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#358B8B" />
                <Text>Loading properties...</Text>
            </View>
        );
    }

    if (!properties.length) {
        return (
            <View style={styles.messageContainer}>
                <Text>No properties available to delete.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Remove Property</Text>
            <Text style={styles.subHeader}>
                Select a property to delete. All information linked with the property will not be recovered after deletion.
            </Text>

            {/* Property Selection with Picker */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedProperty}
                    onValueChange={(itemValue) => setSelectedProperty(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Property" value="" />
                    {properties.map((property) => (
                        <Picker.Item key={property.id} label={property.title} value={property.id} />
                    ))}
                </Picker>
                <HelperText type="error" visible={!selectedProperty}>
                    {selectedProperty ? '' : 'You must select a property.'}
                </HelperText>
            </View>

            {/* Delete Button */}
            <Button
                mode="contained"
                onPress={() =>
                    Alert.alert(
                        'Delete Confirmation',
                        `Are you sure you want to delete this property? This action cannot be undone.`,
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', onPress: handleDeleteProperty, style: 'destructive' },
                        ]
                    )
                }
                disabled={!selectedProperty || loading}
                style={styles.deleteButton}
            >
                {loading ? 'Deleting...' : 'Delete Property'}
            </Button>
        </View>
    );
};

export default RemoveProperty;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
    },
    subHeader: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
    },
    pickerContainer: {
        marginVertical: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: 'white',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    deleteButton: {
        marginTop: 30,
        backgroundColor: '#FB902E',
        padding: 10,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
