import React, { useEffect, useState } from 'react';
import { View, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchCourses = ({ query, setQuery, setFilteredCourses, setCourses }) => {
    const [loading, setLoading] = useState(false);
    const [allCourses, setAllCourses] = useState([]); // New state to store all courses

    useEffect(() => {
        loadAllCourses();
    }, []);

    useEffect(() => {
        if (query.length > 2) {
            const delaySearch = setTimeout(() => {
                fetchCourses(query);
            }, 500);
            return () => clearTimeout(delaySearch);
        } else {
            // Reset filtered courses to all courses when query is cleared
            setFilteredCourses(allCourses);
        }
    }, [query]);

    const loadAllCourses = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('authToken');
            if (!token) return;

            const response = await axios.get(`https://realvistamanagement.com/courses/courses/`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setCourses(response.data.results);
            setFilteredCourses(response.data.results);
            setAllCourses(response.data.results); 
        } catch (error) {
            console.error('Error loading courses:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async (searchQuery) => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('authToken');
            if (!token) return;

            const response = await axios.get(`https://realvistamanagement.com/courses/courses/?search=${searchQuery}`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setFilteredCourses(response.data.results);
        } catch (error) {
            console.error('Error fetching courses:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color="gray" />
            <TextInput
                style={styles.input}
                placeholder="Search courses..."
                value={query}
                onChangeText={setQuery}
                autoCapitalize="none"
            />
            {loading && <ActivityIndicator size="small" color="#4A90E2" style={{ marginLeft: 10 }} />}
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 5,
        marginBottom: 16,
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
    searchButton: {
        backgroundColor: '#4A90E2',
        padding: 10,
        borderRadius: 8,
        marginLeft: 8,
    },
});

export default SearchCourses;