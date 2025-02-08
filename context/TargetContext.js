import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '@/utils/formatCurrency';

// Create context
const TargetContext = createContext();

export const TargetProvider = ({ children }) => {
    const [targets, setTargets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchTargets();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchTargets();
    }, []);

    return (
        <TargetContext.Provider value={{ targets, loading, refreshing, handleRefresh }}>
            {children}
        </TargetContext.Provider>
    );
};

export const useTargetContext = () => useContext(TargetContext);