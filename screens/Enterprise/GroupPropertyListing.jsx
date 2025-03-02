import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { formatCurrency } from '../../utils/formatCurrency';

const GroupPropertiesList = ({ properties, onPress, refreshing, onRefresh }) => {
    if (!properties || properties.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No properties available.</Text>
            </View>
        );
    }

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    };

    const renderPropertyItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.propertyItem}
                onPress={() => onPress(item)}
            >
                <View>
                    <View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.title}>
                                {item.title}{' '}
                                <Text style={{ fontStyle: 'italic', color: 'gray', fontSize: 14 }}>
                                    (Location: {item.location})
                                </Text>
                            </Text>
                            <Text style={{ fontSize: 12, color: '#FB902E' }}>
                                {new Date(item.added_on).toLocaleDateString()}
                            </Text>
                            <Text style={styles.subtitle}>{truncateText(item.description, 100)}</Text>
                        </View>
                        <View style={styles.propertyFeaturesRow}>
                            <View style={styles.propertyFeatures}>
                                <Text style={styles.featuresTitle}>Total slots</Text>
                                <Text style={[styles.percentageReturn, { color: '#FB902E' }]}>
                                    {item.total_slots}
                                </Text>
                            </View>
                            <View style={styles.propertyFeatures}>
                                <Text style={styles.featuresTitle}>Open slots</Text>
                                <Text style={[styles.percentageReturn, { color: '#FB902E' }]}>
                                    {item.available_slots}
                                </Text>
                            </View>
                            <View style={styles.propertyFeatures}>
                                <Text style={styles.featuresTitle}>Price per slot</Text>
                                <Text style={[styles.percentageReturn, { color: '#FB902E' }]}>
                                    {formatCurrency(item.slot_price, item.currency)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <FlatList
            data={properties}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPropertyItem}
            refreshing={refreshing}
            onRefresh={onRefresh}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 8,
    },
    propertyItem: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
    featuresTitle: {
        fontSize: 14,
        color: '#358B8B',
        fontWeight: 'bold',
    },
    propertyFeaturesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'left',
        width: '90%',
    },
    propertyFeatures: {
        flexDirection: 'column',
        justifyContent: 'left',
        alignItems: 'center'
    }
});

export default GroupPropertiesList;
