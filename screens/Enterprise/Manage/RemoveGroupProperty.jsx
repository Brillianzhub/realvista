import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import useGroupProperty from '../../../hooks/useGroupProperty';
import AsyncStorage from '@react-native-async-storage/async-storage';


const RemoveGroupProperty = ({ navigation, route }) => {
    const { uniqueGroupId } = route.params;
    const [selectedProperty, setSelectedProperty] = useState(null);
    const { properties, fetchGroupProperties, setLoading, loading } = useGroupProperty({ uniqueGroupId });

    const handleDeleteProperty = async () => {
        if (!selectedProperty) {
            Alert.alert('Error', 'Please select a property to delete.');
            return;
        }

        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this property?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            setLoading(true);

                            const token = await AsyncStorage.getItem('authToken');
                            if (!token) {
                                Alert.alert('Error', 'Authentication token not found. Please log in again.');
                                return;
                            }

                            const headers = {
                                Authorization: `Token ${token}`,
                            };

                            const response = await axios.delete(
                                `https://www.realvistamanagement.com/enterprise/groups/${uniqueGroupId}/properties/${selectedProperty.id}/`,
                                { headers }
                            );
                            Alert.alert('Success', response.data.detail || 'Property deleted successfully.');
                            fetchGroupProperties();
                        } catch (error) {
                            const errorMessage = error.response?.data?.detail || 'Failed to delete the property. Please try again later.';
                            Alert.alert('Error', errorMessage);
                        } finally {
                            setLoading(false);
                            setSelectedProperty(null);
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };


    const renderProperty = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.propertyItem,
                selectedProperty?.id === item.id && styles.selectedProperty,
            ]}
            onPress={() => setSelectedProperty(item)}
        >
            <Text style={styles.propertyText}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Property to remove</Text>
            {loading && <ActivityIndicator size="large" color="#358B8B" />}
            <FlatList
                data={properties}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderProperty}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProperty}>
                <Text style={styles.deleteButtonText}>Delete Selected Property</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RemoveGroupProperty;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 16,
        // fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'left',
    },
    listContainer: {
        paddingBottom: 20,
    },
    propertyItem: {
        padding: 15,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 10,
    },
    selectedProperty: {
        borderColor: '#358B8B',
    },
    propertyText: {
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: '#FB902E',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    deleteButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
