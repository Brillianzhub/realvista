import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddCoordinatesScreen from '../../screens/AddCordinatesScreen';

const AppProperty = () => {
    const [savedCoordinates, setSavedCoordinates] = useState([]);
    const [showAddCoordinates, setShowAddCoordinates] = useState(false);
    const [propertyDetails, setPropertyDetails] = useState({
        title: 'Sample Property',
        location: 'New York',
        initialInvestment: 100000,
        currentPrice: 120000,
    });

    useEffect(() => {
        // Fetch data from AsyncStorage when the component mounts
        getStoredData();
    }, []);

    const handleSaveCoordinates = (coordinates) => {
        if (coordinates.length) {
            setSavedCoordinates(coordinates);
            setShowAddCoordinates(false);
        }
    };



    const saveData = async () => {
        try {
            const propertyData = {
                ...propertyDetails,
                coordinates: savedCoordinates,
            };
            await AsyncStorage.setItem('propertyData', JSON.stringify(propertyData));
            Alert.alert('Success', 'Property data has been saved.');
        } catch (error) {
            console.log('Error saving data', error);
        }
    };

    const getStoredData = async () => {
        try {
            const data = await AsyncStorage.getItem('propertyData');
            if (data !== null) {
                const parsedData = JSON.parse(data);
                setPropertyDetails({
                    title: parsedData.title,
                    location: parsedData.location,
                    initialInvestment: parsedData.initialInvestment,
                    currentPrice: parsedData.currentPrice,
                });
                setSavedCoordinates(parsedData.coordinates || []);
            }
        } catch (error) {
            console.log('Error retrieving data', error);
        }
    };

    console.log(propertyDetails)

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={propertyDetails.title}
                onChangeText={(text) => setPropertyDetails({ ...propertyDetails, title: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Location"
                value={propertyDetails.location}
                onChangeText={(text) => setPropertyDetails({ ...propertyDetails, location: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Initial Investment"
                value={propertyDetails.initialInvestment.toString()}
                keyboardType="numeric"
                onChangeText={(text) => setPropertyDetails({ ...propertyDetails, initialInvestment: Number(text) })}
            />
            <TextInput
                style={styles.input}
                placeholder="Current Price"
                value={propertyDetails.currentPrice.toString()}
                keyboardType="numeric"
                onChangeText={(text) => setPropertyDetails({ ...propertyDetails, currentPrice: Number(text) })}
            />
            <Text>Coordinates: {savedCoordinates.length > 0 ? JSON.stringify(savedCoordinates) : 'No coordinates added'}</Text>

            {!showAddCoordinates ? (
                <Button title="Add Coordinates" onPress={() => setShowAddCoordinates(true)} />
            ) : (
                <AddCoordinatesScreen onSave={handleSaveCoordinates} />
            )}

            <Button title="Save Data" onPress={saveData} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default AppProperty;
