import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import images from '../../constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const QuizResult = ({ route }) => {
    const { score, total, moduleId } = route.params;

    const percentage = Math.round((score / total) * 100);
    const isPass = percentage >= 70;

    const saveProgress = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert('Authentication Error', 'User not authenticated. Please log in.');
                return;
            }

            const response = await axios.post(
                'https://www.realvistamanagement.com/courses/record-progress/',
                {
                    module_id: moduleId,
                    score,
                    total,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201 || response.status === 200) {
                Alert.alert('Success', 'Progress saved successfully!');
                router.replace('(learn)/Learn')
            } else {
                Alert.alert('Error', response.data?.message || 'Failed to save progress.');
            }
        } catch (error) {
            console.error('Error saving progress:', error);
            Alert.alert('Error', error.response?.data?.error || 'A network error occurred.');
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={isPass ? images.pass : images.fail}
                style={styles.scoreImage}
            />
            <Text style={styles.title}>Quiz Results</Text>
            <Text style={styles.scoreText}>
                You scored {percentage}% ({score} out of {total})!
            </Text>

            {isPass ? (
                <View style={styles.actionContainer}>
                    <Text style={styles.message}>🎉 Great job! Keep up the good work.</Text>
                    <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={saveProgress}>
                        <Text style={styles.buttonText}>Save Progress</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.homeButton]}
                        onPress={() => router.replace('(learn)/Learn')}
                    >
                        <Text style={styles.buttonText}>Go to Home</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.actionContainer}>
                    <Text style={styles.message}>
                        Don't worry! Use the back arrow on the top left hand side of your device to review your answers and try again or click below to continue.
                    </Text>
                    <TouchableOpacity
                        style={[styles.button, styles.retryButton]}
                        onPress={() => router.replace('(learn)/Learn')}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default QuizResult;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    scoreText: {
        fontSize: 18,
        color: '#555',
        marginBottom: 20,
    },
    scoreImage: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    actionContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    message: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
        textAlign: 'center',
    },
    button: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 5,
    },
    homeButton: {
        backgroundColor: '#FB902E',
    },
    retryButton: {
        backgroundColor: '#E74C3C',
    },
    saveButton: {
        backgroundColor: '#27AE60',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
