import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // Importing an icon for the city

const OwnerProfile = () => {
    const route = useRoute();
    const owner = route.params?.owner;

    if (!owner) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No owner data available.</Text>
            </View>
        );
    }

    const {
        active_since = '',
        base_city = 'Unknown',
        email = 'N/A',
        owner_name = 'No Name',
        owner_photo = '',
        phone_number = 'N/A',
    } = owner;

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: owner_photo || 'https://via.placeholder.com/100' }}
                style={styles.image}
            />
            <Text style={styles.name}>{owner_name}</Text>

            {/* City with Icon */}
            <View style={styles.cityContainer}>
                <FontAwesome name="map-marker" size={18} color="red" />
                <Text style={styles.info}>{base_city}</Text>
            </View>

            <Text style={styles.info}>📧 {email}</Text>
            <Text style={styles.info}>📞 {phone_number}</Text>
            {active_since && (
                <Text style={styles.info}>
                    Active Since: {new Date(active_since).toDateString()}
                </Text>
            )}
        </View>
    );
};

export default OwnerProfile;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 16,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    info: {
        fontSize: 16,
        marginLeft: 5,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
});
