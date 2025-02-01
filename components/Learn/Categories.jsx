import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const categories = [
    { id: '1', name: 'Finance', icon: 'attach-money', type: 'MaterialIcons' },
    { id: '2', name: 'Investment', icon: 'trending-up', type: 'MaterialIcons' },
    { id: '3', name: 'Real Estate', icon: 'home', type: 'MaterialIcons' },
    { id: '4', name: 'Stock', icon: 'chart-line', type: 'FontAwesome5' },
    { id: '5', name: 'Crypto', icon: 'bitcoin', type: 'FontAwesome5' },
];

const Categories = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Targeted Topics</Text>
            <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.categoryItem}>
                        {item.type === 'MaterialIcons' ? (
                            <MaterialIcons name={item.icon} size={28} color="#358B8B" />
                        ) : (
                            <FontAwesome5 name={item.icon} size={24} color="#358B8B" />
                        )}
                        <Text style={styles.categoryText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    categoryItem: {
        backgroundColor: '#f1f1f1',
        padding: 12,
        borderRadius: 10,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 90,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 5,
        textAlign: 'center',
    },
});

export default Categories;
