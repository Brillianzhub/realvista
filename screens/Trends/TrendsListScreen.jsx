import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import PagerView from 'react-native-pager-view';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReportList from './ReportList';
import SearchBar from './SearchBar';
import TrendPager from './TrendPager';


const TrendsListScreen = ({ navigation }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const pagerRef = useRef(null);
    const totalPages = 3;
    const autoSlideInterval = 3000;

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                const response = await axios.get('https://www.realvistamanagement.com/trends/reports/', {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });
                setReports(response.data.results);
            } catch (err) {
                setError('Failed to fetch reports');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

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


    const handleReportPress = async (report) => {
        try {
            const token = await AsyncStorage.getItem('authToken');

            setReports((prevReports) =>
                prevReports.map((r) =>
                    r.id === report.id ? { ...r, views: (r.views || 0) + 1 } : r
                )
            );

            navigation.navigate('TrendDetails', { report: { ...report, views: (report.views || 0) + 1 } });

            await axios.patch(
                `https://www.realvistamanagement.com/trends/reports/${report.id}/update_views/`,
                {},
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

        } catch (err) {
            console.error("Failed to update views:", err);
            setReports((prevReports) =>
                prevReports.map((r) =>
                    r.id === report.id ? { ...r, views: (r.views || 0) - 1 } : r
                )
            );
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.get('https://www.realvistamanagement.com/trends/reports/', {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            setReports(response.data.results);
        } catch (err) {
            setError('Failed to refresh reports');
        } finally {
            setRefreshing(false);
        }
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
        <ScrollView
            contentContainerStyle={[styles.container, { paddingBottom: 20 }]}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#358B8B']}
                />
            }
            showsVerticalScrollIndicator={false}
        >
            <SearchBar onResults={setReports} />
            <TrendPager />
            <View style={styles.badge}>
                <Text style={styles.badgeText}>RECENT POSTS</Text>
            </View>
            <ReportList
                reports={reports}
                handleReportPress={handleReportPress}
            />
        </ScrollView>
    );
};

export default TrendsListScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F9F9F9',
        padding: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 5,
        marginBottom: 10,
        backgroundColor: '#f1f1f1',
    },
    input: {
        flex: 1,
        marginLeft: 8,
        height: 40,
        fontSize: 16,
        paddingHorizontal: 8,
        backgroundColor: 'transparent',
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
    badge: {
        borderWidth: 1.5,
        borderColor: 'gray',
        backgroundColor: '#f1f1f1',
        borderRadius: 20,
        padding: 6,
        marginTop: 20,
    },
    badgeText: {
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 14
    }
});