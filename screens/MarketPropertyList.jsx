import images from '@/constants/images';
import React from 'react';
import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import ImageCarousel from '@/components/Market/ImageCarousel';

const MarketPropertyList = ({ properties, formatCurrency }) => {
    const renderProperty = ({ item }) => {
        const validImages = Array.isArray(item.images)
            ? item.images.filter(img => img.image || img.image_url)
            : [];


        return (
            <TouchableOpacity
                style={styles.propertyCard}
                onPress={() =>
                    router.push({
                        pathname: '/(marketdetail)/MarketListingDetails',
                        params: { selectedItemId: JSON.stringify(item.id) },
                    })
                }
            >
                <ImageCarousel images={validImages} />
                <View style={styles.propertyInfo}>
                    <Text style={[styles.propertyTitle, { color: '#358B8B' }]}>{item.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }}>
                        <Text style={[styles.propertyType, { color: '#FB902E', fontWeight: 'bold' }]}>
                            {item?.bedrooms ? `${item?.bedrooms} Bedrooms ` : ''}
                            {item?.property_type
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, char => char.toUpperCase())} for{' '}
                            {item?.listing_purpose
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, char => char.toUpperCase())}
                        </Text>
                    </View>
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

                    <Text style={styles.propertyPrice}>{formatCurrency(item.price, item.currency)}</Text>
                </View>
            </TouchableOpacity>
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
