import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { useNavigation } from '@react-navigation/native';

import TargetDetail from './TargetDetail';

const TargetListScreen = () => {
    const [targets, setTargets] = useState([]);
    const [selectedTarget, setSelectedTarget] = useState(null);
    const bottomSheetModalRef = useRef(null); // Ref for BottomSheet
    const navigation = useNavigation();
    const bottomSheetRef = useRef(null);



    useEffect(() => {
        fetchTargets();
    }, []);

    const openBottomSheet = (item) => {
        setSelectedTarget(item);
        bottomSheetRef.current?.expand();
    };

    const closeBottomSheet = () => {
        bottomSheetRef.current?.close();
        setSelectedTarget(null);
    };

    const fetchTargets = async () => {
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
        }
    };

    const handleTargetPress = (target) => {
        setSelectedTarget(target);
        bottomSheetModalRef.current?.present();
    };

    const renderTarget = ({ item }) => (
        <TouchableOpacity style={styles.targetItem} onPress={() => openBottomSheet(item)}>
            <Text style={styles.targetName}>{item.target_name}</Text>
            <Text style={styles.targetDetails}>Target: {item.target_amount} Naira</Text>
            <Text style={styles.targetDetails}>Savings: {item.current_savings} Naira</Text>
            <Text style={styles.targetDetails}>Progress: {item.progress_percentage.toFixed(2)}%</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.header}>Financial Targets</Text>
                <FlatList
                    data={targets}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderTarget}
                    contentContainerStyle={styles.listContainer}
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('FinancialTarget')}
                >
                    <Ionicons name="add" size={30} color="white" />
                </TouchableOpacity>

                <BottomSheet
                    ref={bottomSheetRef}
                    index={-1}
                    snapPoints={['25%', '50%', '100%']}
                    onClose={closeBottomSheet}
                    style={{ backgroundColor: '#f0f0f0' }}
                    handleStyle={styles.handleContainer}
                    handleIndicatorStyle={styles.handleIndicator}
                >
                    <BottomSheetScrollView
                        contentContainerStyle={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        <TargetDetail
                            selectedTarget={selectedTarget}
                            closeBottomSheet={closeBottomSheet}
                        />
                    </BottomSheetScrollView>
                </BottomSheet>
            </View>
        </View>
    );
};

export default TargetListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollViewContent: {
        paddingBottom: 24,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    listContainer: {
        paddingBottom: 80,
    },
    targetItem: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
        elevation: 3,
    },
    targetName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#358B8B',
    },
    targetDetails: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#358B8B',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },

    handleIndicator: {
        backgroundColor: '#136e8b',
        width: 50,
        height: 5,
        borderRadius: 3,
    },
    handleContainer: {
        backgroundColor: '#358B8B1A',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },


});
