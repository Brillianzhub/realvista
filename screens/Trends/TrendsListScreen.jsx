import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import PagerView from 'react-native-pager-view';
import axios from 'axios';

const TrendsListScreen = ({ navigation }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const pagerRef = useRef(null);
    const totalPages = 3;
    const autoSlideInterval = 3000;

    // Fetch reports from the API
    useEffect(() => {
        axios
            .get('https://www.realvistamanagement.com/trends/public-reports/')
            .then((response) => {
                setReports(response.data.reports);
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to fetch reports');
                setLoading(false);
            });
    }, []);

    // Auto-slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPage((prevPage) => {
                const nextPage = (prevPage + 1) % totalPages;
                if (pagerRef.current) {
                    pagerRef.current.setPage(nextPage);
                }
                return nextPage;
            });
        }, autoSlideInterval);

        return () => clearInterval(interval);
    }, []);

    const handleReportPress = (report) => {
        navigation.navigate('TrendDetails', { report });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#358B8B" />
                <Text style={styles.loadingText}>Loading Trends...</Text>
            </View>
        );
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <PagerView
                style={styles.pagerView}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                <View key="1" style={[styles.page, { backgroundColor: 'rgba(53, 139, 139, 0.2)' }]}>
                    <Text style={styles.pageText}>Explore the latest real estate trends and insights.</Text>
                </View>
                <View key="2" style={[styles.page, { backgroundColor: 'rgb(254 243 199)' }]}>
                    <Text style={styles.pageText}>Stay updated on property values and market dynamics.</Text>
                </View>
                <View key="3" style={[styles.page, { backgroundColor: 'rgb(255 237 213)' }]}>
                    <Text style={styles.pageText}>Gain actionable knowledge for smarter investments.</Text>
                </View>
            </PagerView>

            <View style={styles.progressDots}>
                {[...Array(totalPages)].map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentPage === index && styles.activeDot,
                        ]}
                    />
                ))}
            </View>

            <FlatList
                data={reports}
                keyExtractor={(item) => item.generated_date}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleReportPress(item)}>
                        <View style={styles.reportItem}>
                            <Text style={styles.reportTitle}>
                                {item.location} - {item.property_type}
                            </Text>
                            <Text style={styles.reportDate}>
                                {new Date(item.generated_date).toLocaleDateString()}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default TrendsListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        padding: 16,
    },
    pagerView: {
        height: 150,
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        marginTop: 10,
    },
    pageText: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    progressDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 50,
        backgroundColor: '#CCC',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: 'rgba(53, 139, 139, 1)',
        width: 10,
        height: 10,
        borderRadius: 50,
    },
    reportItem: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    reportDate: {
        color: '#888',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    errorText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'red',
        marginTop: 20,
    },
});
