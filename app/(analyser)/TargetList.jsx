import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
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
        <View style={styles.outerContainer}>
            <View style={styles.contentContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#358B8B" style={styles.activityIndicator} />
                ) : (
                    <FlatList
                        data={targets}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderTarget}
                        contentContainerStyle={styles.listContainer}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                colors={['#358B8B']}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                    />
                )}

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.replace('Analysis')}
                >
                    <Ionicons name="add" size={30} color="white" />
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default TargetListScreen;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#358B8B',
        marginBottom: 20,
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 100,
    },
    targetItem: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#FB902E',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    bottomSheet: {
        backgroundColor: '#f0f0f0',
    },
    handleContainer: {
        backgroundColor: '#358B8B1A',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    handleIndicator: {
        backgroundColor: '#136e8b',
        width: 50,
        height: 5,
        borderRadius: 3,
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
    activityIndicator: {
        marginTop: 20,
    },
});
