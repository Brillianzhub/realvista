import React from 'react';
import { ScrollView, TouchableOpacity, Image, Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatCurrency } from '../../utils/formatCurrency';



const CourseListRenderer = ({ filteredCourses, navigation, loading }) => {
    const calculateTotalLessons = (course) => {
        return course.modules.reduce((total, module) => total + (module.lessons?.length || 0), 0);
    };

    return (
        <ScrollView
            contentContainerStyle={{ paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
        >
            {filteredCourses.length > 0 ? (
                filteredCourses.map((item) => {
                    const totalLessons = calculateTotalLessons(item); 

                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.courseCard}
                            onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
                        >
                            <Image
                                source={{ uri: item.image || 'https://via.placeholder.com/150' }}
                                style={styles.courseImage}
                            />
                            <View style={styles.courseDetails}>
                                <Text style={styles.courseTitle}>{item.title}</Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'flex-start' }}>
                                    <View style={styles.infoRow}>
                                        <Icon name="access-time" size={16} color="#666" />
                                        <Text style={styles.infoText}>{item.duration}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Icon name="library-books" size={16} color="#666" />
                                        <Text style={styles.infoText}>{item.modules.length} Modules</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Icon name="menu-book" size={16} color="#666" />
                                        <Text style={styles.infoText}>{totalLessons} Lessons</Text>
                                    </View>
                                </View>

                                <View style={styles.infoRow}>
                                    <Icon name="people" size={16} color="#666" />
                                    <Text style={styles.infoText}>{item.enrollment_count} Enrollments</Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: 20, marginBottom: 10 }}>
                                    <View style={styles.infoRow}>
                                        <Icon name="star" size={16} color="#FFD700" />
                                        <Text style={styles.infoText}>{item.average_rating.toFixed(1)}</Text>
                                    </View>
                                    {item.is_free ? (
                                        <View style={styles.infoRow}>
                                            <Text style={[styles.infoText, { fontWeight: '600' }]}>Free</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.infoRow}>
                                            <Text style={[styles.infoText, { fontWeight: '600' }]}>{formatCurrency(item.price, item.currency)}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })
            ) : (
                !loading && <Text style={styles.noResults}>No courses found</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    courseCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 20,
    },
    courseImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
    },
    courseDetails: {
        marginTop: 10,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginVertical: 2,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
    },
    noResults: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'gray',
    },
});

export default CourseListRenderer;
