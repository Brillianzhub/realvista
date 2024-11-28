import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapViewer = ({ latitude, longitude, title, description, mapType }) => {

    if (!latitude || !longitude) {
        return null;
    }

    return (
        <View style={styles.mapContainer}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        height: 300, // Fixed height for the map
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 16,
    },
    map: {
        flex: 1,
    },
});

export default MapViewer;
