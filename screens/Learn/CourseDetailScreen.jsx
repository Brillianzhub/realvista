import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '@/context/GlobalProvider';
import CustomProgressBar from '../../components/Learn/CustomProgressBar';
import CourseDescription from '../../components/Learn/CourseDescription';
import { formatCurrency } from '../../utils/formatCurrency';
import CourseDetailsHeader from '../../components/Learn/CourseDetailsHeader';
import WriteReview from '../Learn/WriteReview';

import useProgressTracker from '@/hooks/useProgressTracker';
import { useRouter } from 'expo-router';


const truncateTitle = (title, wordLimit = 4) => {
    const words = title.split(" ");
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(" ") + "...";
    }
    return title;
};


const CourseDetailScreen = ({ route, navigation }) => {
    const { user } = useGlobalContext();
    const { courseId } = route.params;
    const [course, setCourse] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { progress } = useProgressTracker();
    const router = useRouter();

    const completedModules = new Set(progress.map((record) => record.module.id));

    const fetchCourse = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('authToken');
            if (!token) return;

            const response = await axios.get(`https://www.realvistamanagement.com/courses/courses/${courseId}`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setCourse(response.data);
        } catch (error) {
            console.error('Error loading data', error.response?.data || error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleCourseAccess = async () => {
        if (!course) {
            Alert.alert('Error', 'Course information is missing.');
            return;
        }

        if (!course.is_free) {
            router.push({
                pathname: '/(learn)/Payment',
                params: { courseId },
            });
        } else {
            enrollInCourse();
        }
    };

    const enrollInCourse = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) throw new Error('No authentication token found');

            const response = await axios.post(
                `https://www.realvistamanagement.com/courses/enroll/${courseId}/`,
                {},
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            Alert.alert('Success', `You have enrolled in ${course.title}`);
            fetchCourse(); 
        } catch (error) {
            console.error('Enrollment error:', error.response?.data || error.message);
            Alert.alert('Error', error.response?.data?.error || 'Enrollment failed. Try again.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    useEffect(() => {
        if (course && course.enrollments && user?.id) {
            const enrolledCourse = course.enrollments.find(
                (enrollment) => enrollment.user === user.id
            );
            setIsEnrolled(!!enrolledCourse && enrolledCourse.is_active);
        }
    }, [course, user?.id]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCourse();
    };

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

    const totalLessons = course?.modules?.reduce((sum, module) => sum + module.lessons.length, 0) || 0;

    const totalQuestions = course?.modules?.reduce((sum, module) => {
        return sum + module.lessons.reduce((lessonSum, lesson) => {
            return lessonSum + (lesson.questions?.length || 0);
        }, 0);
    }, 0) || 0;

    const handleWriteReview = () => {
        router.push({
            pathname: '/(learn)/Reviews',
            params: {
                courseId
            },
        });
    };



    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {course.image && (
                <Image
                    source={{ uri: course.image }}
                    style={styles.courseImage}
                />
            )}

            <Text style={styles.courseTitle}>{course.title}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'flex-start' }}>
                <View style={styles.infoRow}>
                    <Icon name="access-time" size={16} color="#666" />
                    <Text style={styles.infoText}>{course.duration} Min</Text>
                </View>
                <Icon name="people" size={16} color="#666" />
                <Text style={styles.infoText}>{course.enrollment_count} Enrollments</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'flex-start' }}>
                <View style={styles.infoRow}>
                    <Icon name="library-books" size={16} color="#666" />
                    <Text style={styles.infoText}>{course.modules.length} Modules</Text>
                </View>
                <View style={styles.infoRow}>
                    <Icon name="menu-book" size={16} color="#666" />
                    <Text style={styles.infoText}>{totalLessons} Lessons</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: 20, marginBottom: 10 }}>
                <View style={styles.infoRow}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={styles.infoText}>{course.average_rating.toFixed(1)}</Text>
                </View>
                {course.is_free ? (
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoText, { fontWeight: '600' }]}>Free</Text>
                    </View>
                ) : (
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoText, { fontWeight: '600' }]}>{formatCurrency(course.price, course.currency)}</Text>
                    </View>
                )}
            </View>

            <CourseDetailsHeader
                course={course}
                totalQuestions={totalQuestions}
                onReviews={handleWriteReview}
            />
            <WriteReview
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                courseId={courseId}
                fetchCourse={fetchCourse}
            />

            {isEnrolled ? (
                <View style={styles.progressContainer}>
                    <CustomProgressBar
                        progress={course.enrollments.find(enrollment => enrollment.user === user.id)?.progress_percentage || 0}
                    />
                </View>
            ) : (
                <TouchableOpacity
                    onPress={handleCourseAccess}
                    style={styles.enrollBtn}
                >
                    <Text style={styles.enrollText}>Enroll Now</Text>
                </TouchableOpacity>
            )}

            <View>
                <Text style={styles.courseTitle}>About the Course</Text>
                <CourseDescription description={course.description} />
            </View>

            <Text style={styles.sectionHeader}>Modules</Text>

            {course.modules.map((module) => {
                const isCompleted = completedModules.has(module.id);

                return (
                    <TouchableOpacity
                        key={module.id}
                        style={[styles.moduleCard, !isEnrolled && { opacity: 0.5 }]}
                        onPress={() => {
                            if (isEnrolled) {
                                navigation.navigate('ModuleDetail', {
                                    modules: course.modules,
                                    selectedModuleIndex: module.order - 1,
                                });
                            } else {
                                Alert.alert(
                                    "Access Denied",
                                    "You need to enroll in this course to access the lessons."
                                );
                            }
                        }}
                        disabled={!isEnrolled}
                    >
                        <View style={styles.row}>
                            <Icon
                                name="library-books"
                                size={16}
                                color={isEnrolled ? "#358B8B" : "#ccc"}
                            />

                            <Text
                                style={[styles.moduleTitle, !isEnrolled && { color: '#aaa' }]}
                            >
                                {truncateTitle(module.title, 4)}
                            </Text>

                            {isCompleted && (
                                <Icon name="check-circle" size={18} color="#4CAF50" />
                            )}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
    },
    courseImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 15,
    },
    courseDescription: {
        marginBottom: 20,
    },

    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    moduleCard: {
        backgroundColor: '#f1f1f1',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    moduleTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginLeft: 8,
        marginRight: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginVertical: 2,
    },
    infoText: {
        fontSize: 16,
        color: '#666',
    },
    enrollBtn: {
        borderRadius: 25,
        backgroundColor: '#FB902E',
        padding: 10,
        alignItems: 'center',
        marginVertical: 15
    },
    enrollText: {
        fontSize: 16,
        color: '#fff',
    }
});
