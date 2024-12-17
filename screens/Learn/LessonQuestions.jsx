import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';

const LessonQuestions = ({ route, navigation }) => {
    const { questions, moduleId } = route.params;
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    const handleSelectOption = (questionId, optionId) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };

    const handlePageSelected = (e) => {
        setCurrentPage(e.nativeEvent.position);
    };

    const handleSubmit = () => {
        let score = 0;

        questions.forEach((question) => {
            const correctOption = question.options.find((option) => option.is_correct);
            if (selectedAnswers[question.id] === correctOption?.id) {
                score += 1;
            }
        });

        navigation.navigate('QuizResult', { score, moduleId, total: questions.length });
    };

    return (
        <View style={styles.container}>
            <PagerView
                style={styles.pagerView}
                initialPage={0}
                onPageSelected={handlePageSelected}
            >
                {questions.map((question, index) => (
                    <View key={index} style={styles.page}>
                        <Text style={styles.progressTitle}>
                            Question {index + 1} of {questions.length}
                        </Text>
                        <Text style={styles.questionText}>{question.text}</Text>
                        {question.options.length > 0 ? (
                            question.options.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    onPress={() => handleSelectOption(question.id, option.id)}
                                    style={[
                                        styles.optionButton,
                                        selectedAnswers[question.id] === option.id &&
                                        styles.selectedOption,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selectedAnswers[question.id] === option.id &&
                                            styles.selectedOptionText,
                                        ]}
                                    >
                                        {option.text}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.noOptionsText}>
                                Options will be added soon.
                            </Text>
                        )}
                        {index === questions.length - 1 && (
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.submitButtonText}>Submit</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </PagerView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 20,
    },
    pagerView: {
        flex: 1,
        marginHorizontal: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    progressTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#358B8B',
        marginBottom: 10,
    },
    questionText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    optionButton: {
        width: '100%',
        paddingVertical: 15,
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
    },
    selectedOption: {
        backgroundColor: '#358B8B',
        borderColor: '#358B8B',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    selectedOptionText: {
        color: '#fff',
    },
    noOptionsText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#888',
        marginTop: 10,
    },
    submitButton: {
        marginTop: 30,
        backgroundColor: '#FB902E',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '50%'
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default LessonQuestions;
