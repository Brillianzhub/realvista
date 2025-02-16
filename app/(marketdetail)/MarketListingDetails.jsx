import { StyleSheet, Text, View, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCarousel from '@/components/Market/ImageCarousel';
import { formatCurrency } from '../../utils/formatCurrency';
import FeaturesComponent from '../../components/Market/FeaturesComponent';
import DescriptionComponent from '../../components/DescriptionComponent';
import ContactComponent from '../../components/Market/ContactOwner';
import DetailsComponent from '../../components/Market/DetailsComponent';
import { useGlobalContext } from '@/context/GlobalProvider';
import { handleAddBookmark } from '@/utils/handleBookmarks';
import { MaterialIcons } from "@expo/vector-icons";
import MapViewer from '../../components/MapViewer';
import useUserBookmarks from '@/hooks/useUserBookmark';


const MarketListingDetails = () => {
    const { selectedItemId } = useLocalSearchParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isRecordingInquiry, setIsRecordingInquiry] = useState(false);
    const { user } = useGlobalContext();
    const { bookmarks, fetchBookmarks } = useUserBookmarks();
    const [isBookmarked, setIsBookmarked] = useState(false);


    useEffect(() => {
        fetchBookmarks();
    }, []);

    const onAddBookmark = async () => {
        try {
            const bookmarkStatus = await handleAddBookmark(property.id);
            setIsBookmarked(bookmarkStatus);
            await fetchBookmarks();
        } catch (error) {
            console.error("Bookmark update failed:", error);
        }
    };

    const fetchProperty = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                throw new Error("Authentication token not found!");
            }

            const response = await axios.get(
                `https://realvistamanagement.com/market/properties/${selectedItemId}/`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setProperty(response.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching property:", error);
            setError(error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [selectedItemId]);

    useEffect(() => {
        if (selectedItemId) {
            fetchProperty();
        }
    }, [selectedItemId]);


    useEffect(() => {
        if (bookmarks?.length > 0) {
            setIsBookmarked(bookmarks.some(bookmark => bookmark.property_id === id));
        } else {
            setIsBookmarked(false);
        }
    }, [bookmarks, id]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProperty();
    }, [fetchProperty]);

    if (loading) {
        return (
            <View style={[styles.container, { alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#358B8B" />
                <Text>Loading property details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const {
        id,
        address,
        availability,
        availability_date,
        bathrooms,
        bedrooms,
        city,
        coordinate_url,
        currency,
        description,
        features,
        market_coordinates,
        images,
        image_files,
        videos,
        documents,
        listed_date,
        listing_purpose,
        lot_size,
        owner,
        price,
        property_type,
        square_feet,
        state,
        title,
        updated_date,
        year_built,
        zip_code,
    } = property || {};

    const details = {
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        lot_size: lot_size,
        square_feet: square_feet,
        availability: availability,
        availability_date: availability_date,
        year_built: year_built,
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {property ? (
                <>
                    <View style={styles.imageWrapper}>
                        <ImageCarousel
                            images={image_files}
                            listed_date={listed_date}
                        />
                    </View>

                    <Text style={styles.title}>{title}</Text>

                    <Text style={styles.subtitle}>
                        {address.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())},{' '}
                        {state.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())},{' '}
                        {city.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                    </Text>

                    <View style={styles.bookmarkSection}>
                        <View style={styles.textContainer}>
                            <Text style={styles.price}>
                                {formatCurrency(price, currency)}
                            </Text>
                            <Text style={styles.detailText}>
                                {property_type.charAt(0).toUpperCase() + property_type.slice(1)} •{' '}
                                {listing_purpose.charAt(0).toUpperCase() + listing_purpose.slice(1)}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={onAddBookmark}
                            style={styles.wishlistIcon}
                        >
                            <MaterialIcons
                                name={isBookmarked ? "favorite" : "favorite-border"}
                                size={24}
                                color={isBookmarked ? "#FF5A5F" : "#FF5A5F"}
                            />
                        </TouchableOpacity>
                    </View>

                    <DetailsComponent {...details} />

                    <View style={styles.featuresContainer}>
                        <Text style={styles.sectionTitle}>Property Info.</Text>
                        <DescriptionComponent description={description} />
                    </View>

                    <View style={styles.featuresContainer}>
                        <Text style={styles.sectionTitle}>Features</Text>
                        <View style={{ flex: 1, marginBottom: 10 }}>
                            <FeaturesComponent features={features} />
                        </View>
                    </View>

                    <View style={{ marginBottom: 20 }}>
                        <Text style={styles.sectionTitle}>Map Location</Text>
                        {market_coordinates?.length > 0 && (
                            <MapViewer
                                latitude={market_coordinates[0].latitude}
                                longitude={market_coordinates[0].longitude}
                                title={title}
                            />
                        )}
                    </View>
                    <View style={[styles.ownerContainer, { marginBottom: 20 }]}>
                        <Text style={styles.sectionTitle}>Contact Owner</Text>
                        <ContactComponent
                            owner={owner}
                            property={property}
                            user={user}
                            setIsRecordingInquiry={setIsRecordingInquiry}
                        />
                    </View>
                </>
            ) : (
                <Text>No property details available.</Text>
            )}
        </ScrollView>
    );
};

export default MarketListingDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        paddingHorizontal: 16,
    },
    imageWrapper: {
        marginBottom: 20,
        marginTop: 12
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        marginBottom: 8,
    },
    address: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    price: {
        fontSize: 22,
        fontWeight: '600',
        color: '#FB902E',
        marginBottom: 8,
    },
    detailText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#444',
        marginBottom: 16,
    },
    featuresContainer: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    featureItem: {
        marginBottom: 8,
    },
    featureText: {
        fontSize: 14,
        color: '#555',
    },
    imagesContainer: {
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    ownerContainer: {
        marginBottom: 16,
    },
    ownerText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    bookmarkSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    textContainer: {
        flexDirection: "column",
    },
});