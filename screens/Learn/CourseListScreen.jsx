import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchCourses from '@/components/Learn/SearchCourses';
import IntroPager from '@/components/Learn/IntroPager';
import Categories from '@/components/Learn/Categories';
import CourseListRenderer from '@/components/Learn/CourseListRenderer';


const CourseList = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('authToken');
            if (!token) return;

            const response = await axios.get(`https://www.realvistamanagement.com/courses/courses/`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setCourses(response.data.results);
            setFilteredCourses(response.data.results);
        } catch (error) {
            console.error('Error', error.response?.data || error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCourses();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#358B8B" />
                <Text style={styles.loadingText}>Loading Courses...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#358B8B']}
                />
            }
        >
            <SearchCourses
                query={query}
                setQuery={setQuery}
                courses={courses}
                setCourses={setCourses}
                setFilteredCourses={setFilteredCourses}
            />
            <IntroPager />
            <Categories />

            <Text style={styles.titleHeader}>Popular Courses</Text>
            <CourseListRenderer
                filteredCourses={filteredCourses}
                navigation={navigation}
                loading={loading}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    titleHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
});

export default CourseList;