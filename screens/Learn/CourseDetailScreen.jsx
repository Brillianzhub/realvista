import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CourseDetailScreen = ({ route, navigation }) => {
    const { courseId } = route.params; 
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (!token) {
                    return
                }

                const response = await axios.get(`https://www.realvistamanagement.com/courses/courses/${courseId}`, {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                setCourse(response.data)
            } catch (error) {
                console.error('Error loading data', error.response?.data || error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchCourse()
    }, [courseId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#358B8B" />
                <Text style={styles.loadingText}>Loading Course Details...</Text>
            </View>
        );
    }

    if (!course) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load course details.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <View style={styles.courseDescription}>
                <Text style={styles.courseDescriptionText}>{course.description}</Text>
            </View>
            <Text style={styles.sectionHeader}>Modules</Text>
            <FlatList
                data={course.modules}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.moduleCard}
                        onPress={() => navigation.navigate('ModuleDetail', {
                            modules: course.modules,
                            selectedModuleIndex: item.order - 1,
                        })
                        }
                    >
                        <Text style={styles.moduleTitle}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default CourseDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F9F9F9',
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    courseTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    courseDescription: {
        marginBottom: 20,
        backgroundColor: 'rgb(255 237 213)',
        padding: 15,
        borderRadius: 8
    },
    courseDescriptionText: {
        fontSize: 18,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#358B8B',
        marginBottom: 10,
    },
    moduleCard: {
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
    moduleTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
    },
});
