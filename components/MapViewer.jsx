import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapViewer = ({ latitude, longitude, title, description, virtual_tour_url }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [mapType, setMapType] = useState('hybrid'); // Default map type

    // Extract coordinates from virtual_tour_url if provided
    const extractCoordinatesFromUrl = (url) => {
        const regex = /(?:q=)([-+]?[0-9]*\.?[0-9]+),([-+]?[0-9]*\.?[0-9]+)/;
        const match = url.match(regex);
        if (match) {
            return {
                latitude: parseFloat(match[1]),
                longitude: parseFloat(match[2]),
            };
        }
        return null;
    };

    // Determine latitude and longitude
    if (!latitude || !longitude) {
        if (virtual_tour_url) {
            const coordinates = extractCoordinatesFromUrl(virtual_tour_url);
            if (coordinates) {
                latitude = coordinates.latitude;
                longitude = coordinates.longitude;
            }
        }
        if (!latitude || !longitude) {
            return null;
        }
    }

    // Toggle fullscreen modal
    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

    // Toggle map type
    const toggleMapType = () => {
        const nextMapType = mapType === 'standard' ? 'satellite' : mapType === 'satellite' ? 'hybrid' : 'standard';
        setMapType(nextMapType);
    };

    return (
        <View style={styles.mapContainer}>
            {/* Main Map */}
            <MapView
                style={styles.map}
                mapType={mapType}
                initialRegion={{
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    coordinate={{ latitude, longitude }}
                    title={title}
                    description={description}
                />
            </MapView>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleFullscreen}>
                    <Text style={styles.buttonText}>View Fullscreen</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={toggleMapType}>
                    <Text style={styles.buttonText}>Toggle Map</Text>
                </TouchableOpacity>
            </View>

            {/* Fullscreen Modal */}
            <Modal
                visible={isFullscreen}
                animationType="slide"
                onRequestClose={toggleFullscreen}
                transparent={false}
            >
                <View style={styles.modalContainer}>
                    <MapView
                        style={styles.fullscreenMap}
                        mapType={mapType}
                        initialRegion={{
                            latitude,
                            longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={{ latitude, longitude }}
                            title={title}
                            description={description}
                        />
                    </MapView>

                    <View style={styles.modalButtonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={toggleFullscreen}>
                            <Text style={styles.buttonText}>Close Fullscreen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={toggleMapType}>
                            <Text style={styles.buttonText}>Toggle Map</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        height: 300,
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 16,
    },
    map: {
        flex: 1,
    },
    buttonsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        right: 8,
        padding: 10,
        borderRadius: 8,
        gap: 10
    },
    modalContainer: {
        flex: 1,
    },
    fullscreenMap: {
        ...StyleSheet.absoluteFillObject,
    },
    modalButtonsContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        padding: 4,
        gap: 10
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: '#FB902E',
        borderRadius: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default MapViewer;
