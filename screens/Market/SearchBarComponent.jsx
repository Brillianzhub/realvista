import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SearchBarComponent = ({ searchQuery, setSearchQuery, onApplyFilters, onFilterPress }) => {

    const handleApplyFilters = () => {
        onApplyFilters({
            description: '', 
            city: '',
            state: '',
            minPrice: null,
            maxPrice: null,
            generalSearch: searchQuery.trim(), 
        });
    };

    return (
        <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color="gray" />
            <TextInput
                style={styles.input}
                placeholder="Search properties..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleApplyFilters}
            />
            <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
                <MaterialCommunityIcons name="filter-variant" size={24} color="gray" />
            </TouchableOpacity>
        </View>
    );
};

export default SearchBarComponent;

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 0,
        marginBottom: 10,
        backgroundColor: '#f1f1f1',
    },
    input: {
        flex: 1,
        marginLeft: 8,
        height: 40,
        fontSize: 16,
        paddingHorizontal: 8,
        backgroundColor: 'transparent',
    },
    filterButton: {
        marginLeft: 10,
        padding: 8,
        borderRadius: 8,
    },
});