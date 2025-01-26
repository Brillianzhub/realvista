import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, ScrollView, Modal } from 'react-native';
import * as Location from 'expo-location';
import CustomForm from '../components/CustomForm';
import { Ionicons } from '@expo/vector-icons';

const CoordinateForm = ({ property, onSubmit }) => {
    const [coordinates, setCoordinates] = useState([]);
    const [utmX, setUtmX] = useState('');
    const [utmY, setUtmY] = useState('');
    const [utmZone, setUtmZone] = useState('32');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUTMInput, setIsUTMInput] = useState(true); // Toggle between UTM and WGS84

    const handlePickCoordinates = async () => {
        setIsFetchingLocation(true);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setIsFetchingLocation(false);
            Alert.alert('Permission Denied', 'Location permission is required to fetch coordinates.');
            return;
        }

        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            const { latitude, longitude } = location.coords;

            setCoordinates((prevCoordinates) => [
                ...prevCoordinates,
                { latitude, longitude },
            ]);

            Alert.alert('Success', 'Coordinates added successfully!');
        } catch (error) {
            console.error('Location fetching error:', error);
            Alert.alert('Error', 'Could not get location. Please try again.');
        } finally {
            setIsFetchingLocation(false);
        }
    };

    const addCoordinate = () => {
        if (isUTMInput) {
            if (!utmX || !utmY) {
                Alert.alert('Error', 'Please fill in both UTM X and UTM Y fields.');
                return;
            }

            const newCoordinate = {
                utm_x: parseFloat(utmX),
                utm_y: parseFloat(utmY),
                utm_zone: parseInt(utmZone, 10),
            };

            if (isNaN(newCoordinate.utm_x) || isNaN(newCoordinate.utm_y) || isNaN(newCoordinate.utm_zone)) {
                Alert.alert('Error', 'Invalid UTM coordinate values. Please check your input.');
                return;
            }

            setCoordinates([...coordinates, newCoordinate]);
            setUtmX('');
            setUtmY('');
            setUtmZone('32');
        } else {
            if (!latitude || !longitude) {
                Alert.alert('Error', 'Please fill in both Latitude and Longitude fields.');
                return;
            }

            const newCoordinate = {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            };

            if (isNaN(newCoordinate.latitude) || isNaN(newCoordinate.longitude)) {
                Alert.alert('Error', 'Invalid WGS84 coordinate values. Please check your input.');
                return;
            }

            setCoordinates([...coordinates, newCoordinate]);
            setLatitude('');
            setLongitude('');
        }
    };

    const handleSubmit = () => {
        if (coordinates.length === 0) {
            Alert.alert('Error', 'Please add at least one coordinate.');
            return;
        }

        const payload = {
            property: property.id,
            coordinates,
        };

        onSubmit(payload);
    };

    const toggleModal = () => setIsModalVisible(!isModalVisible);
    const toggleInputType = () => setIsUTMInput(!isUTMInput);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            <TouchableOpacity style={styles.questionIconContainer} onPress={toggleModal}>
                <Ionicons name="help-circle-outline" size={24} color="#358B8B" style={styles.questionIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleButton} onPress={toggleInputType}>
                <Text style={styles.toggleButtonText}>
                    {isUTMInput ? 'Switch to WGS84 (Latitude/Longitude)' : 'Switch to UTM Coordinates'}
                </Text>
            </TouchableOpacity>

            {isUTMInput ? (
                <>
                    <CustomForm
                        label="UTM X"
                        required
                        placeholder="Enter UTM X (Easting mE)"
                        keyboardType="numeric"
                        onChangeText={setUtmX}
                        value={utmX}
                    />
                    <CustomForm
                        label="UTM Y"
                        required
                        placeholder="Enter UTM Y (Northing mN)"
                        keyboardType="numeric"
                        value={utmY}
                        onChangeText={setUtmY}
                    />
                    <CustomForm
                        label="UTM Zone (Default: 32)"
                        required
                        placeholder="Enter UTM Zone"
                        keyboardType="numeric"
                        value={utmZone}
                        onChangeText={setUtmZone}
                    />
                </>
            ) : (
                <>
                    <CustomForm
                        label="Latitude"
                        required
                        placeholder="Enter Latitude e.g. 5.496648"
                        keyboardType="numeric"
                        value={latitude}
                        onChangeText={setLatitude}
                    />
                    <CustomForm
                        label="Longitude"
                        required
                        placeholder="Enter Longitude e.g. 7.525206"
                        keyboardType="numeric"
                        value={longitude}
                        onChangeText={setLongitude}
                    />
                </>
            )}

            <TouchableOpacity style={[styles.button, { backgroundColor: '#e9e9e9', }]} onPress={addCoordinate}>
                <Text style={{ fontSize: 16, fontWeight: '600', }}>Add Coordinate</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handlePickCoordinates}
                disabled={isFetchingLocation}
            >
                <Text style={styles.buttonText}>
                    {isFetchingLocation ? 'Fetching Location...' : 'Pick Coordinates (WGS84)'}
                </Text>
            </TouchableOpacity>

            {isFetchingLocation && <ActivityIndicator size="small" color="#358B8B" style={styles.loadingIndicator} />}

            <View style={{ marginTop: 20 }}>
                {coordinates.map((item, index) => (
                    <View key={index} style={styles.coordinateItem}>
                        <Text>Coordinate {index + 1}:</Text>
                        {item.latitude && item.longitude ? (
                            <Text>Latitude: {item.latitude}, Longitude: {item.longitude}</Text>
                        ) : (
                            <Text>UTM X: {item.utm_x}, UTM Y: {item.utm_y}, Zone: {item.utm_zone}</Text>
                        )}
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>
                            To locate the property on Google Maps, please provide at least one coordinate using either the UTM or WGS84 method. If you also wish to calculate the property area, you will need to provide a minimum of three coordinates. Please ensure all coordinates are accurate to minimize errors in the area calculation.
                        </Text>
                        <TouchableOpacity style={styles.closeModalButton} onPress={toggleModal}>
                            <Text style={styles.closeModalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default CoordinateForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        paddingBottom: 50,
    },
    questionIconContainer: {
        marginBottom: 10
    },
    toggleButton: {
        marginVertical: 15,
        padding: 10,
        backgroundColor: '#FB902E',
        borderRadius: 8,
        alignItems: 'center',
    },
    toggleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    button: {
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: '#358B8B',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingIndicator: {
        marginTop: 10,
    },
    coordinateItem: {
        backgroundColor: '#e9e9e9',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
    },
    submitButton: {
        backgroundColor: '#FB902E',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    modalText: {
        fontSize: 16,
        color: '#333',
    },
    closeModalButton: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#FB902E',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeModalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});


