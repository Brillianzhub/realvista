import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const PropertyDetailScreen = ({ route, navigation }) => {
    const { propertyId, propertyName } = route.params;
    const [propertyDetails, setPropertyDetails] = useState(null);

    // Fetch property details from backend
    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                const response = await fetch(`https://your-api.com/properties/${propertyId}`);
                const data = await response.json();
                setPropertyDetails(data);
            } catch (error) {
                console.error('Error fetching property details:', error);
            }
        };

        fetchPropertyDetails();
    }, [propertyId]);

    // const navigation = useNavigation();

    const handleContactSeller = () => {
        // Navigate to a contact page or open a messaging form
        navigation.navigate('ContactSeller', { propertyId });
    };

    // useEffect(() => {
    //     navigation.setOptions({
    //         title: propertyName, // Set property name as header title
    //         headerLeft: () => (
    //             <TouchableOpacity onPress={() => navigation.goBack()}>
    //                 <CustomBackIcon /> {/* Your custom back icon */}
    //             </TouchableOpacity>
    //         ),
    //     });
    // }, [navigation, propertyName]);

    if (!propertyDetails) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={{ uri: propertyDetails.imageUrl }} // Image URL from API
                style={styles.propertyImage}
            />
            <Text style={styles.propertyTitle}>{propertyDetails.title}</Text>
            <Text style={styles.propertyPrice}>${propertyDetails.price}</Text>
            <Text style={styles.propertyDescription}>{propertyDetails.description}</Text>

            {/* Contact Seller Button */}
            <Button title="Contact Seller" onPress={handleContactSeller} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    propertyImage: {
        width: '100%',
        height: 250,
        borderRadius: 10,
    },
    propertyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    propertyPrice: {
        fontSize: 20,
        color: 'green',
        marginVertical: 5,
    },
    propertyDescription: {
        fontSize: 16,
        color: 'gray',
        marginVertical: 10,
    },
});

export default PropertyDetailScreen;
