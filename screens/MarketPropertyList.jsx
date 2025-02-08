import images from '@/constants/images';
import React from 'react';
import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { router } from 'expo-router';
import ImageCarousel from '@/components/Market/ImageCarousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Linking from 'expo-linking';

const MarketPropertyList = ({ properties, formatCurrency }) => {


    const handleViewProperty = async (propertyId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token is missing');
            }

            const response = await axios.get(
                `https://www.realvistamanagement.com/market/view-property/${propertyId}/`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

        } catch (error) {
            console.error('Error viewing property:', error.response?.data || error.message);
        }
    };

    const handleShareProperty = (property) => {
        const deepLink = Linking.createURL('/MarketListingDetails', {
            queryParams: { selectedItemId: property.id },
        });

        console.log(deepLink)

        const shareOptions = {
            message: `Check out this property: ${property.title}\n\n${property.description}\n\nPrice: ${formatCurrency(property.price, property.currency)}\nLocation: ${property.city}, ${property.state}\n\nView more details: ${deepLink}`,
            title: 'Share Property',
            url: deepLink,
        };

        Share.share(shareOptions)
            .then((result) => {
                if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                        // Shared with activity type of result.activityType
                    } else {
                        // Shared
                    }
                } else if (result.action === Share.dismissedAction) {
                    // Dismissed
                }
            })
            .catch((error) => {
                console.error('Error sharing property:', error);
            });
    };


    const renderProperty = ({ item }) => {
        const validImages = Array.isArray(item.image_files)
            ? item.image_files.filter(img => img.file || img.image_url)
            : [];

        return (
            <View style={styles.propertyCard}>

                <ImageCarousel images={validImages} listed_date={item.listed_date} />

                <TouchableOpacity
                    onPress={async () => {
                        await handleViewProperty(item.id);
                        router.push({
                            pathname: '/(marketdetail)/MarketListingDetails',
                            params: { selectedItemId: JSON.stringify(item.id) },
                        });
                    }}
                >
                    <View style={styles.propertyInfo}>
                        <Text style={[styles.propertyTitle, { color: '#358B8B' }]}>
                            {item.title}
                        </Text>

                        <Text style={[styles.propertyType, { color: '#FB902E', fontWeight: 'bold' }]}>
                            {item?.bedrooms ? `${item?.bedrooms} Bedrooms ` : ''}
                            {item?.property_type
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, char => char.toUpperCase())} for{' '}
                            {item?.listing_purpose
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, char => char.toUpperCase())}
                        </Text>

                        <Text style={[styles.propertyDescription]} numberOfLines={2} ellipsizeMode="tail">
                            {item.description}
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }}>
                            <Image source={images.location} style={{ width: 20, height: 20 }} />
                            <Text style={styles.propertyDetails}>
                                {item.state.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}, {' '}
                                {item.city.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                            </Text>
                        </View>

                        <Text style={styles.propertyPrice}>
                            {formatCurrency(item.price, item.currency)}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    style={styles.shareButton}
                    onPress={() => handleShareProperty(item)}
                >
                    <Text style={styles.shareButtonText}>Share</Text>
                </TouchableOpacity> */}
            </View>
        );
    };

    return (
        <FlatList
            data={properties}
            renderItem={renderProperty}
            keyExtractor={item => item.id.toString()}
            style={styles.propertiesList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.emptyText}>No properties found</Text>}
        />
    );
};

export default MarketPropertyList;

const styles = StyleSheet.create({
    propertyCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
        width: '100%',
    },
    propertyInfo: {
        padding: 10,
    },
    propertyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    propertyDescription: {
        fontSize: 16,
        paddingVertical: 5,
        color: '#444',
    },
    propertyDetails: {
        fontSize: 14,
        marginBottom: 5,
        color: '#666',
    },
    propertyType: {
        fontSize: 16,
        marginBottom: 5,
    },
    propertyPrice: {
        fontSize: 20,
        fontWeight: '600',
        marginVertical: 5,
        color: '#FB902E',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#aaa',
    },
});