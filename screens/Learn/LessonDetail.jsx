import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import images from '../../constants/images';
import Video from 'react-native-video';
// import { Video } from 'expo-av';


const LessonDetail = ({ route, navigation }) => {
    const { lessons, selectedIndex, moduleId } = route.params || {};
    const [currentPage, setCurrentPage] = useState(0);

    const allQuestions = lessons.reduce((acc, lesson) => acc.concat(lesson.questions), []);

    useEffect(() => {
        const totalLessons = lessons.length;
        if (selectedIndex < totalLessons) {
            navigation.setOptions({
                title: `Lesson ${selectedIndex + 1}/${totalLessons}`,
            });
        } else {
            navigation.setOptions({
                title: "Questions",
            });
        }
    }, [selectedIndex, lessons, navigation]);

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


    return (
        <PagerView
            style={styles.pagerView}
            initialPage={selectedIndex}
            onPageSelected={(e) => {
                const newPage = e.nativeEvent.position;
                setCurrentPage(newPage);
                updateHeaderTitle(newPage);
            }}
        >

            {lessons.map((lesson, index) => (
                <View key={lesson.id} style={styles.page}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.lessonTitle}>{lesson.title}</Text>
                        <Text style={styles.lessonDescription}>{lesson.description}</Text>

                        {/* Video content */}
                        {/* {lesson.video_url && (
                            <Video
                                source={{ uri: lesson.video_url }}
                                style={styles.videoFrame}
                                useNativeControls
                                resizeMode="contain"
                                isLooping
                                onError={(e) => console.error('Video Error:', e)} // Debugging video errors
                            />

                        )} */}

                        <Text style={styles.lessonContent}>
                            {lesson.content || 'Content coming soon...'}
                        </Text>
                    </ScrollView>
                </View>
            ))}


            <View style={styles.content}>
                <Image
                    source={images.complete}
                    style={styles.gifImage}
                />
                <Text style={styles.lessonTitle}>Congratulations</Text>
                <Text style={styles.lessonDescription}>
                    Test your understanding of the lesson with these questions.
                </Text>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('LessonQuestions', { questions: allQuestions, moduleId: moduleId })
                    }
                    style={styles.continueButton}
                >
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Start Questions</Text>
                </TouchableOpacity>
            </View>
        </PagerView>
    );
};

export default LessonDetail;

const styles = StyleSheet.create({
    pagerView: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        marginBottom: 20
    },
    page: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    lessonTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'left',
        marginTop: 20
    },
    lessonDescription: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        textAlign: 'center'
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
    videoFrame: {
        width: '100%',
        height: 200,
        backgroundColor: 'black',
    },

});
