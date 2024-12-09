import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

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
                onPress={() => onPress(item)}
            >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.address}</Text>
                <Text
                    style={[
                        styles.percentageReturn,
                        { color: item.percentageReturn < 0 ? 'red' : styles.percentageReturn.color }
                    ]}
                >
                    Return: {item.percentageReturn}%
                </Text>
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
    percentageReturn: {
        fontSize: 14,
        color: '#358B8B', // Use a color of your choice
        marginTop: 10,
        fontWeight: 'bold',
    },
});

export default PropertiesList;
