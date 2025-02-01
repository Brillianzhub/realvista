import React, { useState, useEffect, useRef } from 'react';
import { Image, TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import images from '../../constants/images';

const LessonDetail = ({ route, navigation }) => {
    const { lessons, selectedIndex, moduleId } = route.params || {};
    const [currentPage, setCurrentPage] = useState(selectedIndex);
    const pagerRef = useRef(null);


    const allQuestions = lessons.reduce((acc, lesson) => acc.concat(lesson.questions), []);

    useEffect(() => {
        updateHeaderTitle(currentPage);
    }, [currentPage]);

    const updateHeaderTitle = (pageIndex) => {
        const totalLessons = lessons.length;
        if (pageIndex < totalLessons) {
            navigation.setOptions({
                title: `Lesson ${pageIndex + 1}/${totalLessons}`,
            });
        } else {
            navigation.setOptions({
                title: "Questions",
            });
        }
    };

    const handleNext = () => {
        if (pagerRef.current && currentPage < lessons.length) {
            pagerRef.current.setPage(currentPage + 1);
        }
    };

    return (
        <View style={styles.container}>
            <PagerView
                ref={pagerRef}
                style={styles.pagerView}
                initialPage={selectedIndex}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                {lessons.map((lesson, index) => (
                    <View key={lesson.id} style={styles.page}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.lessonTitle}>{lesson.title}</Text>
                            <Text style={styles.lessonDescription}>{lesson.description}</Text>
                            <Text style={styles.lessonContent}>{lesson.content || 'Content coming soon...'}</Text>
                        </ScrollView>
                    </View>
                ))}
                <View style={styles.content}>
                    <Image source={images.complete} style={styles.gifImage} />
                    <Text style={styles.lessonTitle}>Congratulations</Text>
                    <Text style={styles.lessonDescription}>
                        Test your understanding of the lesson with these questions.
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('LessonQuestions', { questions: allQuestions, moduleId: moduleId })}
                        style={styles.continueButton}
                    >
                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Start Questions</Text>
                    </TouchableOpacity>
                </View>
            </PagerView>
            {currentPage < lessons.length && (
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default LessonDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
    },
    pagerView: {
        flex: 1,
        backgroundColor: '#FFF',
        marginBottom: 20,
    },
    page: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    lessonTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'left',
        marginTop: 20,
    },
    lessonDescription: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        textAlign: 'center',
    },
    lessonContent: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    continueButton: {
        marginTop: 30,
        backgroundColor: '#FB902E',
        paddingVertical: 12,
        borderRadius: 8,
        width: '50%',
        alignItems: 'center',
    },
    gifImage: {
        width: 50,
        height: 50,
        marginBottom: 20,
    },
    nextButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#358B8B',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
