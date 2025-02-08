import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import MarketDocumentUploader from '@/components/Market/MarketDocumentUploader';
import { useLocalSearchParams } from 'expo-router';

const AddImages = () => {
    const { property } = useLocalSearchParams();
    const { colors } = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!property) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={styles.errorText}>Property ID is missing. Please go back and try again.</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {isSubmitting ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#358B8B" />
                    <Text style={styles.loadingText}>Uploading images...</Text>
                </View>
            ) : (
                <MarketDocumentUploader propertyId={property} setIsSubmitting={setIsSubmitting} />
            )}
        </View>
    );
};

export default AddImages;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#358B8B',
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#FF0000', 
    },
});