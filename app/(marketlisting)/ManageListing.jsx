import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';

const ManageListing = () => {
    const { selectedListing } = useLocalSearchParams();
    const { colors } = useTheme();

    const [isLoading, setLoading] = useState(false);

    if (!selectedListing) return null;

    const listing = JSON.parse(selectedListing);

    const handleUpdate = () => {
        const propertyId = listing.id;
        router.push({
            pathname: '(marketlisting)/UpdateListing',
            params: { property: JSON.stringify(propertyId) },
        });
    };

    const handleFeaturesUpdate = () => {
        const propertyId = listing.id;
        router.push({
            pathname: '(marketlisting)/MarketFeatures',
            params: { property: propertyId },
        });
    };

    const handleAddImages = () => {
        const propertyId = listing.id;
        router.push({
            pathname: '(marketlisting)/AddImages',
            params: { property: JSON.stringify(propertyId) },
        });
    }

    const handleAddCoordinates = () => {
        const propertyId = listing.id;
        router.push({
            pathname: '(marketlisting)/ListingCoordinates',
            params: { property: JSON.stringify(propertyId) },
        });
    }

    const handleBack = () => {
        router.replace('/(marketlisting)/MarketListing');
    }
    const handleDelete = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('authToken')
            if (!token) { return }

            const response = await fetch(`https://www.realvistamanagement.com/market/delete-property/${listing.id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Property deleted successfully');
                router.replace('/(marketlisting)/MarketListing');
            } else {
                Alert.alert('Error', data.error || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error deleting property:', error);
            Alert.alert('Error', 'An error occurred while deleting the property');
        } finally {
            setLoading(false);
        }
    };

    const formattedDate = moment(listing.listed_date).format('DD-MM-YYYY');

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.insightContainer}>
                <View style={styles.insightAnalysis}>
                    <Text style={styles.modalViews}>Listed on</Text>
                    <Text style={[styles.modalViews, styles.modalViewsBold]}>{formattedDate}</Text>
                </View>
                <View style={styles.insightAnalysis}>
                    <Text style={styles.modalViews}>Total Views</Text>
                    <Text style={[styles.modalViews, styles.modalViewsBold]}>{listing.views}</Text>
                </View>
                <View style={styles.insightAnalysis}>
                    <Text style={styles.modalViews}>Total Inquieries</Text>
                    <Text style={[styles.modalViews, styles.modalViewsBold]}>{listing.inquiries}</Text>
                </View>
                <View style={styles.insightAnalysis}>
                    <Text style={styles.modalViews}>Total Bookmarks</Text>
                    <Text style={[styles.modalViews, styles.modalViewsBold]}>{listing.bookmarked}</Text>
                </View>
            </View>
            {/* Buttons Section */}
            <View style={styles.buttonGrid}>
                {/* Update Button */}
                <TouchableOpacity
                    style={[styles.button, styles.updateButton]}
                    onPress={handleUpdate}
                >
                    <MaterialIcons name="update" size={24} color="#358B8B" />
                    <Text style={styles.buttonText}>Update Details</Text>
                </TouchableOpacity>

                {/* Update Features Button */}
                <TouchableOpacity
                    style={[styles.button, styles.updateFeaturesButton]}
                    onPress={handleFeaturesUpdate}
                >
                    <FontAwesome name="pencil-square-o" size={22} color="#358B8B" />
                    <Text style={styles.buttonText}>Update Features</Text>
                </TouchableOpacity>

                {/* Add Images Button */}
                <TouchableOpacity
                    style={[styles.button, styles.updateFeaturesButton]}
                    onPress={handleAddImages}
                >
                    <Feather name="image" size={22} color="#358B8B" />
                    <Text style={styles.buttonText}>Add Files/Images</Text>
                </TouchableOpacity>
                {/* Add Images Button */}
                <TouchableOpacity
                    style={[styles.button, styles.updateFeaturesButton]}
                    onPress={handleAddCoordinates}
                >
                    <Feather name="map-pin" size={22} color="#358B8B" />
                    <Text style={styles.buttonText}>Add Coordinates</Text>
                </TouchableOpacity>

                {/* Delist Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        Alert.alert(
                            'Confirm Delist',
                            'Are you sure you want to delist this property?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Yes, Delist', onPress: handleDelete },
                            ]
                        );
                    }}
                >
                    <MaterialIcons name="delete-outline" size={24} color="#358B8B" />
                    <Text style={styles.buttonText}>Delist Listing</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

export default ManageListing;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    insightContainer: {
        marginVertical: 20,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    insightAnalysis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    modalViews: {
        fontSize: 16,
        color: '#333',
    },
    modalViewsBold: {
        fontWeight: '600',
    },
    modalButtons: {
        marginVertical: 10,
    },
    buttonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    button: {
        width: '48%',
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#358B8B0D',
        alignItems: 'center',
        justifyContent: 'left',
        marginBottom: 10,
        flexDirection: 'row',
        gap: 8,
    },
    buttonText: {
        fontSize: 16,
    }
});