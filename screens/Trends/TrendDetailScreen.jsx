import { StyleSheet, Text, View, Image, Linking, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const TrendDetailScreen = ({ route }) => {
    const { report } = route.params;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { paddingBottom: 20 }]}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.title}>{report.title}</Text>
            <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                    <View style={styles.metaItem}>
                        <MaterialIcons name="date-range" size={16} color="#666" />
                        <Text style={styles.metaText}>{formatDate(report.date_created)}</Text>
                    </View>
                    <MaterialIcons name="source" size={16} color="#666" />
                    <Text style={styles.metaText}>{report.source}</Text>
                </View>

            </View>
            <Image source={{ uri: report.attachment }} style={styles.image} />
            <Text style={styles.body}>{report.body}</Text>
            <Text
                style={styles.url}
                onPress={() => Linking.openURL(report.url)}
            >
                Go to source website
            </Text>
        </ScrollView>
    );
};

export default TrendDetailScreen;

const { width: screenWidth } = Dimensions.get('window');

const dynamicFontSize = screenWidth < 380 ? 20 : 22;

const styles = StyleSheet.create({
    container: {
        padding: 18,
    },
    title: {
        fontSize: dynamicFontSize,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    metaText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 16,
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
        textAlign: 'justify'
    },
    url: {
        color: '#358B8B',
        textDecorationLine: 'underline',
        marginBottom: 16,
    },
});