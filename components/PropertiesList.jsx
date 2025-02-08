import images from '@/constants/images';
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { formatCurrency } from '@/utils/formatCurrency';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PropertiesList = ({ properties, onPress, refreshing, onRefresh }) => {

    if (!properties || properties.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No properties available.</Text>
            </View>
        );
    }

    const renderPropertyItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.propertyItem}
                onPress={() => onPress({ item })}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <MaterialCommunityIcons name="home" size={24} color="#358B8B" />
                        <View>
                            <Text style={styles.title}>{item.title}</Text>
                            {item.user_slots && item.group_owner_name ? (
                                <Text style={{ fontWeight: '400', fontSize: 12 }}>{item.group_owner_name} - {item.user_slots} Slots</Text>
                            ) : (
                                <Text style={{ fontWeight: '400', fontSize: 12, color: 'gray' }}>Personal Property</Text>
                            )}
                            <Text style={{ fontWeight: '600', color: '#358B8B' }}>{formatCurrency(item.current_value, item.currency)}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                        <Image
                            source={item.percentage_performance > 0 ? images.profit : images.loss}
                            style={{ alignItems: 'center', width: 12, height: 12 }}
                        />
                        <Text
                            style={[
                                styles.percentageReturn,
                                { color: item.percentage_performance < 0 ? 'red' : styles.percentageReturn.color }
                            ]}
                        >
                            {item.percentage_performance ? item.percentage_performance.toFixed(2) : '0.00'}%
                        </Text>
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
    propertyItem: {
        backgroundColor: "#f1f1f1",
        padding: 12,
        marginVertical: 8,
        borderRadius: 15,
    },
    title: {
        fontSize: 16,
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
    percentageReturn: {
        fontSize: 14,
        color: '#358B8B',
        fontWeight: 'bold',
    },
});

export default PropertiesList;