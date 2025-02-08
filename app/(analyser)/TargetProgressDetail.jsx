import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Svg, Circle } from 'react-native-svg';
import { formatCurrency } from '@/utils/formatCurrency';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import AddContributionModal from '../../screens/Analysis/AddContributionModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const TargetProgressDetail = () => {
    const { selectedItemId } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [target, setTarget] = useState(null);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTarget = async () => {
        if (!selectedItemId) {
            console.error('Target ID is required.');
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found.');
                return;
            }

            const response = await axios.get(`https://www.realvistamanagement.com/analyser/financial-targets/${selectedItemId}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setTarget(response.data);
        } catch (error) {
            console.error('Error fetching financial target:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTarget();
    }, [selectedItemId])

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchTarget();
        setRefreshing(false);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#358B8B" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    if (!selectedItemId) {
        return <Text>No target data available.</Text>;
    }

    const {
        target_name,
        target_amount,
        current_savings,
        start_date,
        end_date,
        currency,
        progress_percentage,
        remaining_amount,
        contributions,
        months_remaining,
        minimum_monthly_contribution,
    } = target;

    const progress = Math.min(progress_percentage, 100);

    const radius = 50;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - (progress / 100) * circumference;

    return (
        <View style={styles.container}>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                <Text style={styles.title}>{target_name}</Text>

                <View style={styles.targetAmount}>
                    <Text>Target Amount</Text>
                    <Text style={styles.amount}>{formatCurrency(target_amount, currency)}</Text>
                </View>

                <View style={styles.progressContainer}>
                    <Svg width={120} height={120} viewBox="0 0 120 120">
                        <Circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke="#e0e0e0"
                            strokeWidth={strokeWidth}
                            fill="none"
                            transform="rotate(-90, 60, 60)"
                        />
                        <Circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke="#358B8B"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={progressOffset}
                            strokeLinecap="round"
                            transform="rotate(-90, 60, 60)"
                        />
                    </Svg>
                    <Text style={styles.progressText}>{progress.toFixed(1)}%</Text>
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.subTitle}>Savings Details</Text>

                    <View style={styles.row}>
                        <FontAwesome5 name="piggy-bank" size={18} color="#4CAF50" />
                        <Text style={styles.label}>Current Savings</Text>
                        <Text style={styles.value}>{formatCurrency(current_savings, currency)}</Text>
                    </View>

                    <View style={styles.row}>
                        <MaterialIcons name="event" size={18} color="#2196F3" />
                        <Text style={styles.label}>Start Date</Text>
                        <Text style={styles.value}>{start_date}</Text>
                    </View>

                    <View style={styles.row}>
                        <MaterialIcons name="event" size={18} color="#FF9800" />
                        <Text style={styles.label}>End Date</Text>
                        <Text style={styles.value}>{end_date}</Text>
                    </View>

                    <View style={styles.row}>
                        <MaterialIcons name="trending-down" size={20} color="#9C27B0" />
                        <Text style={styles.label}>Remaining Amount</Text>
                        <Text style={styles.value}>{formatCurrency(remaining_amount, currency)}</Text>
                    </View>

                    <View style={styles.row}>
                        <MaterialCommunityIcons name="calendar-clock" size={18} color="#9C27B0" />
                        <Text style={styles.label}>Months Remaining</Text>
                        <Text style={styles.value}>{months_remaining}</Text>
                    </View>

                    <View style={styles.row}>
                        <FontAwesome5 name="hand-holding-usd" size={18} color="#673AB7" />
                        <Text style={styles.label}>Min Monthly Contribution</Text>
                        <Text style={styles.value}>{formatCurrency(minimum_monthly_contribution, currency)}</Text>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.subTitle}>Contributions Details</Text>
                    {contributions.length > 0 ? (
                        contributions.map((contribution) => (
                            <View key={contribution.id} style={styles.contributionItem}>
                                <FontAwesome5 name="hand-holding-usd" size={20} color="#FFA500" style={{ marginRight: 10 }} />

                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.contributionDetails, { fontWeight: 'bold' }]}>
                                        Amount
                                    </Text>
                                    <Text style={styles.contributionDetails}>
                                        {contribution.date}
                                    </Text>
                                </View>

                                <Text style={[styles.contributionDetails, { fontWeight: 'bold' }]}>
                                    {formatCurrency(contribution.amount, currency)}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.noContributions}>
                            <MaterialCommunityIcons name="cash-remove" size={24} color="#FF0000" />
                            <Text style={styles.noContributionsText}>No Contributions Yet</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.fixedButtonContainer}>
                <TouchableOpacity style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <FontAwesome5 name="plus-circle" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Add Contribution</Text>
                </TouchableOpacity>

                <AddContributionModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    selectedItemId={selectedItemId}
                    fetchTarget={fetchTarget}
                />
            </View>
        </View>
    );
};

export default TargetProgressDetail;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    scrollContainer: {
        paddingBottom: 100, // To prevent content from overlapping with button
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subTitle: {
        fontWeight: '600',
        fontSize: 18,
        marginBottom: 8
    },
    targetAmount: {
        alignItems: 'center'
    },
    amount: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
    },
    progressContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        position: 'relative',
    },
    progressText: {
        position: 'absolute',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#358B8B',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 5,
    },
    label: {
        fontSize: 14,
        flex: 1,
        marginLeft: 10,
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'right',
        flex: 1,
    },
    contributionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
        marginBottom: 5,
    },
    contributionDetails: {
        fontSize: 14,
    },
    noContributions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
    },
    noContributionsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF0000',
        marginLeft: 8,
    },
    fixedButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        width: '100%',

        alignItems: 'center',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FB902E',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.3,
        // shadowRadius: 4,
        // elevation: 5,
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
        // fontWeight: 'bold',
        color: '#fff',
        marginLeft: 8,
    },
});
