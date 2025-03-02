import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

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
            <View style={styles.infoContainer}>
                <View style={styles.labelContainer}>
                    <FontAwesome name="map-marker" size={18} color="red" />
                    <Text style={styles.label}>City:</Text>
                </View>
                <Text style={styles.info}>{base_city}</Text>
            </View>

            {/* Email with Icon */}
            <View style={styles.infoContainer}>
                <View style={styles.labelContainer}>
                    <FontAwesome name="envelope" size={16} color="#6565f6ec" />
                    <Text style={styles.label}>Email:</Text>
                </View>
                <Text style={styles.info}>{email}</Text>
            </View>

            {/* Phone with Icon */}
            <View style={styles.infoContainer}>
                <View style={styles.labelContainer}>
                    <FontAwesome name="phone" size={16} color="green" />
                    <Text style={styles.label}>Phone:</Text>
                </View>
                <Text style={styles.info}>{phone_number}</Text>
            </View>

            {/* Active Since */}
            {active_since && (
                <View style={styles.infoContainer}>
                    <View style={styles.labelContainer}>
                        <FontAwesome name="calendar" size={16} color="orange" />
                        <Text style={styles.label}>Active Since:</Text>
                    </View>
                    <Text style={styles.info}>
                        {new Date(active_since).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default OwnerProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginBottom: 10,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    info: {
        fontSize: 16,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
});