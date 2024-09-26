import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'; // For Expo

const CoordinatePicker = ({ onSave }) => {
    const [location, setLocation] = useState(null);
    const [pickedLocation, setPickedLocation] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let userLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        })();
    }, []);

    const handleMapPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setPickedLocation({ latitude, longitude });
    };

    const handleSaveLocation = () => {
        if (pickedLocation) {
            onSave(pickedLocation);
            Alert.alert('Coordinates Saved', `Lat: ${pickedLocation.latitude}, Lng: ${pickedLocation.longitude}`);
        } else {
            Alert.alert('No Location Picked', 'Please tap on the map to pick a location.');
        }
    };

    return (
        <View style={styles.container}>
            {location ? (
                <>
                    <MapView
                        style={styles.map}
                        initialRegion={location}
                        onPress={handleMapPress}
                    >
                        {pickedLocation && (
                            <Marker
                                coordinate={pickedLocation}
                                title="Picked Location"
                            />
                        )}
                    </MapView>
                    <Button title="Save Location" onPress={handleSaveLocation} />
                </>
            ) : (
                <Text>Loading map...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    map: {
        width: '100%',
        height: 400,
    },
});

export default CoordinatePicker;
