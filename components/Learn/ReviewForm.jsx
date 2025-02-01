import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReviewForm = ({ courseId, onClose, onReviewSubmit }) => {
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [grade, setGrade] = useState('average'); // Default grade
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!rating || !grade) {
            Alert.alert('Error', 'Please provide a rating, grade, and comment.');
            return;
        }

        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('authToken');

            const response = await axios.post(
                `https://realvistamanagement.com/courses/review/${courseId}/`,
                { rating: parseFloat(rating), grade, comment },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                }
            );

            Alert.alert('Success', 'Review submitted successfully!');
            setRating('');
            setGrade('average');
            setComment('');
            onClose();
            if (onReviewSubmit) {
                onReviewSubmit();
            }
        } catch (err) {
            Alert.alert('Error', err.response?.data?.error || 'Failed to submit review.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.label}>Rating (0.0 - 5.0):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={rating}
                onChangeText={setRating}
                placeholder="Enter rating"
            />

            <Text style={styles.label}>Grade:</Text>
            <Picker
                selectedValue={grade}
                onValueChange={(itemValue) => setGrade(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Excellent" value="excellent" />
                <Picker.Item label="Good" value="good" />
                <Picker.Item label="Average" value="average" />
                <Picker.Item label="Below Average" value="below_average" />
                <Picker.Item label="Poor" value="poor" />
            </Picker>

            <Text style={styles.label}>Comment:</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                value={comment}
                onChangeText={setComment}
                placeholder="Write your review..."
            />

            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.submitButtonText}>
                    {loading ? 'Submitting...' : 'Submit Review'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ReviewForm;

const styles = StyleSheet.create({
    formContainer: {
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        fontSize: 14,
    },
    picker: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginTop: 5,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        marginTop: 20,
        paddingVertical: 12,
        backgroundColor: '#FB902E',
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});