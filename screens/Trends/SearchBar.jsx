import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debounce } from 'lodash';

const SearchBar = ({ onResults }) => {
    const [query, setQuery] = useState('');

    const fetchReports = async (searchQuery) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.get(`https://www.realvistamanagement.com/trends/reports/?search=${searchQuery}`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            onResults(response.data.results);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const debouncedSearch = debounce((text) => {
        fetchReports(text);
    }, 500);

    const handleChangeText = (text) => {
        setQuery(text);
        debouncedSearch(text);
    };

    const handleClear = () => {
        setQuery('');
        onResults([]);
    };

    return (
        <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color="gray" />
            <TextInput
                style={styles.input}
                placeholder="Search reports..."
                value={query}
                onChangeText={handleChangeText}
                autoCapitalize="none"
                accessibilityLabel="Search input"
                accessibilityRole="search"
            />
            {query.length > 0 && (
                <TouchableOpacity onPress={handleClear}>
                    <MaterialIcons name="clear" size={24} color="gray" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = {
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 5,
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
};

export default SearchBar;
