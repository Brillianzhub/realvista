import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatCurrency } from '@/utils/formatCurrency';
import { useRouter } from 'expo-router';


const TargetListScreen = () => {
    const [targets, setTargets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetchTargets();
    }, []);

    const fetchTargets = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found.');
                return;
            }

            const response = await axios.get('https://www.realvistamanagement.com/analyser/financial-targets/', {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setTargets(response.data);
        } catch (error) {
            console.error('Error fetching financial targets:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTarget = async (targetId) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this financial target?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        setLoading(true);

                        try {
                            const token = await AsyncStorage.getItem('authToken');
                            if (!token) {
                                console.error('No authentication token found.');
                                Alert.alert('Error', 'No authentication token found. Please log in again.');
                                setLoading(false);
                                return;
                            }

                            const response = await axios.delete(
                                `https://www.realvistamanagement.com/analyser/financial-targets/${targetId}/delete_target/`,
                                {
                                    headers: {
                                        Authorization: `Token ${token}`,
                                        'Content-Type': 'application/json',
                                    },
                                }
                            );

                            Alert.alert('Success', 'Financial Target deleted successfully!');
                            await fetchTargets();

                        } catch (error) {
                            console.error('Error Response:', error.response?.data);
                            Alert.alert(
                                'Error',
                                error.response?.data
                                    ? `Failed to delete Financial Target: ${JSON.stringify(error.response.data)}`
                                    : 'An unknown error occurred. Please try again.'
                            );
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchTargets();
        setRefreshing(false);
    };

    const renderTarget = ({ item }) => {
        const progress = Math.min(item.progress_percentage, 100);

        return (
            <TouchableOpacity
                style={styles.targetItem}

                onPress={() =>
                    router.push({
                        pathname: '/(analyser)/TargetProgressDetail',
                        params: { selectedItemId: JSON.stringify(item.id) },
                    })
                }

            >
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: 8,
                }}>
                    <Text style={styles.targetName}>{item.target_name}</Text>
                    <TouchableOpacity
                        onPress={() => handleDeleteTarget(item.id)}
                        style={{
                            width: 25,
                            height: 25,
                            borderRadius: 12.5,
                            borderWidth: 2,
                            borderColor: '#d3d3d3',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#d3d3d3' }}>X</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{progress.toFixed(2)}% Progress</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.targetDetails}>Target</Text>
                    <Text style={[styles.targetDetails, { fontWeight: '600' }]}>{formatCurrency(item.target_amount, item.currency)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.targetDetails}>Savings</Text>
                    <Text style={[styles.targetDetails, { fontWeight: '600' }]}>{formatCurrency(item.current_savings, item.currency)}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView
            style={styles.outerContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#358B8B']} />
            }
        >
            {!loading && targets.length > 0 && (
                <View style={styles.headerContainer}>
                    <Ionicons name="wallet-outline" size={24} color="#358B8B" style={styles.headerIcon} />

                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Every step counts! Keep saving and growing.</Text>
                        <Text style={styles.headerSubtitle}>Stay consistent, and watch your dreams become reality.</Text>
                        <TouchableOpacity
                            style={styles.addTargetButton2} onPress={() => router.replace('Analysis')}
                        >
                            <Text style={styles.addTargetButtonText}>Add Savings Target</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {!loading && targets.length === 0 && (
                <View style={styles.emptyStateContainer}>
                    <Ionicons name="wallet-outline" size={40} color="#358B8B" />
                    <Text style={styles.emptyStateTitle}>Start Your Savings Plan Today</Text>
                    <Text style={styles.emptyStateSubtitle}>Save towards investment goals</Text>
                    <TouchableOpacity style={styles.addTargetButton} onPress={() => router.replace('Analysis')}>
                        <Text style={styles.addTargetButtonText}>Add Savings Target</Text>
                    </TouchableOpacity>
                </View>
            )}

            {loading ? (
                <ActivityIndicator size="large" color="#358B8B" style={styles.activityIndicator} />
            ) : (
                targets.map((item) => (
                    <View key={item.id.toString()}>{renderTarget({ item })}</View>
                ))
            )}
        </ScrollView>
    );
};

export default TargetListScreen;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },

    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#358B8B0D',
        justifyContent: 'flex-start',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
    },
    headerIcon: {
        marginRight: 15,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#777',
        marginVertical: 5,
    },

    targetItem: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
    },
    targetName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#358B8B',
    },
    targetDetails: {
        fontSize: 16,
        marginTop: 5,
    },
    progressBarContainer: {
        height: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        marginVertical: 8,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#358B8B',
    },
    progressText: {
        fontSize: 12,
        color: '#555',
        marginBottom: 8,
    },

    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginTop: 50,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 15,
    },
    emptyStateSubtitle: {
        fontSize: 16,
        color: '#777',
        marginVertical: 10,
        textAlign: 'center',
    },
    addTargetButton2: {
        marginTop: 15,
        backgroundColor: '#FB902E',
        paddingVertical: 8,
        borderRadius: 8,
    },

    addTargetButton: {
        marginTop: 5,
        backgroundColor: '#FB902E',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignSelf: 'center',
    },
    addTargetButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    activityIndicator: {
        marginTop: 20,
    },
});
