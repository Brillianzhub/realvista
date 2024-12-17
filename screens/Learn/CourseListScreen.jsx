import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import PagerView from 'react-native-pager-view';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CourseList = ({ navigation }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0); // Track the current page in PagerView
    const pagerRef = useRef(null); // Ref for PagerView
    const totalPages = 3; // Total number of pages in the PagerView
    const autoSlideInterval = 3000; // Auto-slide interval in milliseconds

    const fetchCourses = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                return;
            }
            setLoading(true);
            const response = await axios.get(`https://www.realvistamanagement.com/courses/courses/`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setCourses(response.data);
        } catch (error) {
            console.error('Error', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        // Auto-slide functionality
        const interval = setInterval(() => {
            setCurrentPage((prevPage) => {
                const nextPage = (prevPage + 1) % totalPages;
                if (pagerRef.current) {
                    pagerRef.current.setPage(nextPage); // Programmatically set the page
                }
                return nextPage;
            });
        }, autoSlideInterval);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Loading Courses...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Pager View for Learning Objectives */}
            <PagerView
                style={styles.pagerView}
                initialPage={0}
                ref={pagerRef} // Assign the PagerView ref here
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)} // Update the current page index
            >

                <View key="1" style={[styles.page, { backgroundColor: 'rgba(53, 139, 139, 0.2)' }]}>
                    <Text style={styles.pageText}>
                        Learn the fundamentals of investment and real estate portfolio management.
                    </Text>
                </View>
                <View key="2" style={[styles.page, { backgroundColor: 'rgb(254 243 199)' }]}>
                    <Text style={styles.pageText}>
                        Understand strategies for long-term wealth building and financial security.
                    </Text>
                </View>
                <View key="3" style={[styles.page, { backgroundColor: 'rgb(255 237 213)' }]}>
                    <Text style={styles.pageText}>
                        Gain insights tailored for beginners and professionals alike.
                    </Text>
                </View>
            </PagerView>

            {/* Progress Dots */}
            <View style={styles.progressDots}>
                {[...Array(totalPages)].map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentPage === index && styles.activeDot, // Highlight the active dot
                        ]}
                    />
                ))}
            </View>

            {/* Course List */}
            <FlatList
                data={courses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.courseCard}
                        onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
                    >
                        <Text style={styles.courseTitle}>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        padding: 16
    },
    pagerView: {
        height: 150,
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        marginTop: 10
    },
    pageText: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    progressDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 50,
        backgroundColor: '#CCC',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: 'rgba(53, 139, 139, 1)',
        width: 10,
        height: 10,
        borderRadius: 50,
    },
    courseCard: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#358B8B',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
});

export default CourseList;
