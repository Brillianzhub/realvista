import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomProgressBar = ({ progress }) => {
    const progressPercentage = Math.min(Math.max(progress, 0), 100);

    return (
        <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Progress: {progressPercentage}%</Text>
            <View style={styles.barContainer}>
                <View style={[styles.filledBar, { width: `${progressPercentage}%` }]} />
            </View>
        </View>
    );
};

export default CustomProgressBar;

const styles = StyleSheet.create({
    progressContainer: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        alignItems: 'flex-start',
        marginVertical: 20
    },
    progressText: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    barContainer: {
        width: '100%',
        height: 8,
        backgroundColor: '#d9f3f3',
        borderRadius: 5,
        overflow: 'hidden',
    },
    filledBar: {
        height: '100%',
        backgroundColor: '#358B8B',
    },
});
