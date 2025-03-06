import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import useFetchPropertiesByEmail from '../../hooks/useFetchVendorProperties';
import { formatCurrency } from '../../utils/formatCurrency';
import { useRouter } from 'expo-router';


const OwnerProfile = () => {
    const route = useRoute();
    const owner = route.params?.owner;

    const router = useRouter();

    const { properties, loading, error, refetch } = useFetchPropertiesByEmail(owner?.email);
    const [refreshing, setRefreshing] = useState(false);
    console.log(owner)

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();  // Fetch properties again
        setRefreshing(false);
    }, [refetch]);

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
        contact_by_email = false,
        contact_by_phone = false,
        contact_by_whatsapp = false
    } = owner;

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Image
                source={{ uri: owner_photo || 'https://via.placeholder.com/100' }}
                style={styles.image}
            />
            <Text style={styles.name}>{owner_name}</Text>

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

            {/* City with Icon */}
            <View style={styles.infoContainer}>
                <View style={styles.labelContainer}>
                    <FontAwesome name="map-marker" size={18} color="red" />
                    <Text style={styles.label}>City:</Text>
                </View>
                <Text style={styles.info}>{base_city}</Text>
            </View>

            {/* Email with Icon */}
            {contact_by_email && (
                <View style={styles.infoContainer}>
                    <View style={styles.labelContainer}>
                        <FontAwesome name="envelope" size={16} color="#6565f6ec" />
                        <Text style={styles.label}>Email:</Text>
                    </View>
                    <Text style={styles.info}>{email}</Text>
                </View>
            )}

            {/* Phone (Only if allowed) */}
            {contact_by_phone && (
                <View style={styles.infoContainer}>
                    <View style={styles.labelContainer}>
                        <FontAwesome name="phone" size={16} color="green" />
                        <Text style={styles.label}>Phone:</Text>
                    </View>
                    <Text style={styles.info}>{phone_number}</Text>
                </View>
            )}

            <Text style={styles.listingHeader}>Other Listings from the Vendor</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#358B8B" style={styles.loader} />
            ) : error ? (
                <Text style={styles.errorText}>Error loading properties.</Text>
            ) : properties.length === 0 ? (
                <Text style={styles.noListing}>No listings available.</Text>
            ) : (
                properties.slice(0, 10).map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.propertyContainer}

                        onPress={() =>
                            router.push({
                                pathname: '/(marketdetail)/MarketListingDetails',
                                params: { selectedItemId: JSON.stringify(item.id) },
                            })
                        }
                    >
                        <Image
                            source={{
                                uri: item.image_files?.[0]?.file || 'https://via.placeholder.com/80'
                            }}
                            style={styles.propertyImage}
                        />
                        <View style={styles.propertyInfo}>
                            <Text style={styles.propertyTitle}>{item.title}</Text>
                            <Text style={styles.propertyDesc} numberOfLines={2} ellipsizeMode="tail">
                                {item.description}
                            </Text>
                            <Text style={styles.propertyPrice}>
                                {formatCurrency(item.price, item.currency)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );
};

export default OwnerProfile;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 16,
    },
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

    listingHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    noListing: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 10,
    },
    propertyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    propertyImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    propertyInfo: {
        flex: 1,
    },
    propertyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    propertyDesc: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 4,
    },
    propertyPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FB902E',
    },
});