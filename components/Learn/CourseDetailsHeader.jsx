import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CourseDetailsHeader = ({ course, totalQuestions, onReviews }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.item, styles.levelContainer]}>
                <Icon name="school" size={20} color="#fff" />
                <Text style={styles.text}>{course.level}</Text>
            </View>

            <View style={[styles.item, styles.quizContainer]}>
                <Icon name="quiz" size={20} color="#fff" />
                <Text style={styles.text}>{totalQuestions} Quiz</Text>
            </View>

            <TouchableOpacity
                style={[styles.item, styles.reviewContainer]}
                onPress={onReviews}
            >
                <Icon name="rate-review" size={20} color="#fff" />
                <Text style={styles.text}>Reviews</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: '#f5f5f5',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    levelContainer: {
        backgroundColor: '#FF6F61', // Coral color
    },
    quizContainer: {
        backgroundColor: '#6B5B95', // Purple color
    },
    reviewContainer: {
        backgroundColor: '#88B04B', // Green color
    },
    text: {
        marginLeft: 8,
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default CourseDetailsHeader;