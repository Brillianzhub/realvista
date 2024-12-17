import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import images from '../../constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuizResult = ({ route }) => {
    const { score, total, moduleId } = route.params;

    const percentage = Math.round((score / total) * 100);
    const isPass = percentage >= 60;

    const saveProgress = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                alert('User not authenticated. Please log in.');
                return;
            }

            const response = await fetch('https://www.realvistamanagement.com/courses/save-progress', {
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    moduleId,
                    score,
                    total,
                }),
            });

            if (response.ok) {
                alert('Progress saved successfully!');
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                alert(`Failed to save progress: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error saving progress:', error);
            alert('A network error occurred. Please check your connection and try again.');
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
                    <TouchableOpacity
                        style={[styles.button, styles.saveButton]}
                        onPress={() => saveProgress()}
                    >
                        <Text style={styles.buttonText}>Save Progress</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.homeButton]}
                        onPress={() => router.replace('Home')}
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
                        onPress={() => router.replace('Home')}
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
