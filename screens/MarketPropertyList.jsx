import images from '@/constants/images';
import React from 'react';
import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const MarketPropertyList = ({ properties, openBottomSheet, formatCurrency }) => {
    const renderProperty = ({ item }) => {
        const imageUrl =
            item.images && item.images.length > 0
                ? item.images[0].image || item.images[0].image_url
                : 'https://via.placeholder.com/150';

        return (
            <View style={styles.propertyCard}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.propertyImage}
                />
                <View style={styles.propertyInfo}>
                    <Text style={[styles.propertyTitle, { color: '#358B8B' }]}>{item.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }}>
                        <Text style={[styles.propertyType, { color: '#FB902E', fontWeight: 'bold' }]}>
                            {item?.bedrooms ? `${item?.bedrooms} Bedrooms ` : ''}
                            {item?.property_type
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, (char) => char.toUpperCase())} for{' '}
                            {item?.listing_purpose
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </Text>
                    </View>
                    <Text
                        style={[styles.propertyDescription]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {item.description}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }}>
                        <Image
                            source={images.location}
                            style={{ width: 20, height: 20 }}
                        />
                        <Text style={styles.propertyDetails}>
                            {item.state
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                            ,{' '}
                            {item.city
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </Text>
                    </View>

                    <Text style={styles.propertyPrice}>
                        {formatCurrency(item.price, item.currency)}
                    </Text>
                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={() => openBottomSheet(item)}
                    >
                        <Text style={styles.contactButtonText}>View Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };


    return (
        <FlatList
            data={properties}
            renderItem={renderProperty}
            keyExtractor={(item) => item.id.toString()}
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
    },
    propertyImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    propertyInfo: {
        padding: 8
    },
    propertyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    propertyDescription: {
        fontSize: 18,
        paddingVertical: 5,
    },
    propertyDetails: {
        fontSize: 16,
        marginBottom: 5,
        color: '#666',
    },
    propertyType: {
        fontSize: 20,
        marginBottom: 5,
    },
    propertyPrice: {
        fontSize: 24,
        fontWeight: '600',
        marginVertical: 5,
        color: '#FB902E',
        textAlign: 'center'
    },
    contactButton: {
        backgroundColor: '#FB902E',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    contactButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#aaa',
    },
});
