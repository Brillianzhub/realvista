import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CoordinateList = ({ coordinates, role, onRefresh, closeBottomSheet }) => {
    if (!coordinates || coordinates.length === 0) {
        return <Text style={styles.noCoordinates}>No coordinates available</Text>;
    }

    const handleRemoveCoordinate = async (item) => {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken?.trim()) {
            Alert.alert('Error', 'Authentication token is missing or invalid.');
            return;
        }

        if (!item || !item.id) {
            console.error("Invalid coordinate item", item);
            return;
        }

        Alert.alert(
            'Delete Coordinate',
            'Are you sure you want to delete this coordinate?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        const coordinateId = item.id;
                        const url = `https://www.realvistamanagement.com/enterprise/group-property/coordinate/${coordinateId}/delete/`;

                        try {
                            const response = await fetch(url, {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Token ${authToken}`,
                                },
                            });

                            if (response.ok) {
                                onRefresh();
                                closeBottomSheet();
                            } else {
                                console.error("Failed to delete coordinate", await response.text());
                            }
                        } catch (error) {
                            console.error("Error deleting coordinate", error);
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };



    return (
        <View style={styles.container}>
            {coordinates.map((item, index) => (
                <View
                    key={index}
                    style={[
                        styles.coordinateItem,
                        index === 0 ? styles.activeCoordinate : null,
                    ]}
                >
                    <Text style={styles.coordinateText}>
                        {index === 0 ? '⭐ Active Coordinate:' : `📍 ${index + 1}:`}
                        ({item.latitude}, {item.longitude})
                    </Text>

                    {/* Show "Remove Coordinate" button only for SUPERADMIN */}
                    {role !== 'MEMBER' && (
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => handleRemoveCoordinate(item)}
                        >
                            <Text style={styles.removeButtonText}>X</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    coordinateItem: {
        padding: 10,
        marginVertical: 4,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    activeCoordinate: {
        backgroundColor: '#d4edda',
        borderColor: '#155724',
        borderWidth: 1,
    },
    coordinateText: {
        fontSize: 14,
        color: '#333',
    },
    removeButton: {
        backgroundColor: '#ff4d4d',
        borderRadius: 50,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    noCoordinates: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default CoordinateList;
