import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const AddCoordinatesScreen = ({ onSave }) => {
    const [coordinates, setCoordinates] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);

    const [manualLatitude, setManualLatitude] = useState('');
    const [manualLongitude, setManualLongitude] = useState('');

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setCurrentLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        })();
    }, []);

    const addPoint = () => {
        if (currentLocation) {
            setCoordinates([...coordinates, currentLocation]);
        }
    };

    const savePoints = () => {
        if (coordinates.length >= 3) {
            onSave(coordinates);
        } else {
            alert('You need at least 3 points to define an area.');
        }
    };


    const handleAddManualCoordinate = () => {
        if (manualLatitude && manualLongitude) {
            const newCoordinate = {
                latitude: parseFloat(manualLatitude),
                longitude: parseFloat(manualLongitude),
            };
            setCoordinates([...coordinates, newCoordinate]);
            setManualLatitude('');
            setManualLongitude('');
        } else {
            alert('Please enter valid coordinates');
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
            {currentLocation && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    {coordinates.length >= 3 && (
                        <Polygon
                            coordinates={coordinates}
                            fillColor="rgba(0, 200, 0, 0.3)"
                            strokeColor="rgba(0,0,0,0.5)"
                            strokeWidth={2}
                        />
                    )}

                    {coordinates.map((coordinate, index) => (
                        <Marker key={index} coordinate={coordinate} title={`Point ${index + 1}`} />
                    ))}
                </MapView>
            )}

            <View style={{ marginTop: 50 }}>
                <TextInput
                    style={styles.input}
                    placeholder='Enter Latitude'
                    keyboardType='numeric'
                    value={manualLatitude}
                    onChangeText={setManualLatitude}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Enter Longitude'
                    keyboardType='numeric'
                    value={manualLongitude}
                    onChangeText={setManualLongitude}
                />
                <Button title="Add Manually Entered Coordinate" onPress={handleAddManualCoordinate} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Add Point" onPress={addPoint} />
                <Button title="Save Points" onPress={savePoints} />
                <Button title="Cancel" onPress={() => onSave([])} />
            </View>



            <View style={styles.pointList}>
                <Text>Selected Points:</Text>
                {coordinates.map((coordinate, index) => (
                    <Text key={index}>
                        Point {index + 1}: ({coordinate.latitude.toFixed(6)}, {coordinate.longitude.toFixed(6)})
                    </Text>
                ))}
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 20
    },
    map: {
        width: '100%',
        height: 300,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    pointList: {
        padding: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 5,
    },
});

export default AddCoordinatesScreen;
