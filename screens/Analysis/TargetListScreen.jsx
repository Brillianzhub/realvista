import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useNavigation } from '@react-navigation/native';
import TargetDetail from './TargetDetail';

const TargetListScreen = () => {
    const [targets, setTargets] = useState([]);
    const [selectedTarget, setSelectedTarget] = useState(null);
    const bottomSheetRef = useRef(null);
    const navigation = useNavigation();

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

    const renderTarget = ({ item }) => (
        <TouchableOpacity style={styles.targetItem} onPress={() => openBottomSheet(item)}>
            <Text style={styles.targetName}>{item.target_name}</Text>
            <Text style={styles.targetDetails}>Target: {item.target_amount} Naira</Text>
            <Text style={styles.targetDetails}>Savings: {item.current_savings} Naira</Text>
            <Text style={styles.targetDetails}>Progress: {item.progress_percentage.toFixed(2)}%</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.outerContainer}>
            <View style={styles.contentContainer}>
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
            </View>

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={['25%', '50%', '100%']}
                onClose={closeBottomSheet}
                style={styles.bottomSheet}
                handleStyle={styles.handleContainer}
                handleIndicatorStyle={styles.handleIndicator}
            >
                <BottomSheetScrollView
                    contentContainerStyle={styles.bottomSheetContent}
                    showsVerticalScrollIndicator={false}
                >
                    <TargetDetail
                        selectedTarget={selectedTarget}
                        closeBottomSheet={closeBottomSheet}
                    />
                </BottomSheetScrollView>
            </BottomSheet>
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
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#358B8B',
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

});
