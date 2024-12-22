import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    TouchableOpacity,
    Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddTargetModal from './AddTargetModal';

const FinancialTargetScreen = () => {
    const [targetAmount, setTargetAmount] = useState('');
    const [currentSavings, setCurrentSavings] = useState('');
    const [timeframe, setTimeframe] = useState('');
    const [rateOfReturn, setRateOfReturn] = useState('');
    const [monthlyContribution, setMonthlyContribution] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [targets, setTargets] = useState([]);

    const calculateContribution = () => {
        const target = parseFloat(targetAmount);
        const current = parseFloat(currentSavings) || 0; // Allow 0 savings
        const years = parseFloat(timeframe);
        const annualRate = parseFloat(rateOfReturn) / 100;

        if (!target || !years || isNaN(annualRate)) {
            setMonthlyContribution('Please enter valid inputs.');
            return;
        }

        const periods = years * 12; 
        const monthlyRate = annualRate / 12; 

        // Compound interest formula: FV = PV * (1 + r)^n + PMT * [(1 + r)^n - 1] / r
        const futureValue = target - current * Math.pow(1 + monthlyRate, periods);

        if (monthlyRate === 0) {
            setMonthlyContribution((futureValue / periods).toFixed(2));
        } else {
            const contribution = (futureValue * monthlyRate) / (Math.pow(1 + monthlyRate, periods) - 1);
            setMonthlyContribution(contribution.toFixed(2));
        }
    };

    const saveTarget = async (newTarget) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found.');
                return;
            }

            const response = await axios.post(
                'https://www.realvistamanagement.com/analyser/financial-targets/',
                newTarget,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setTargets((prevTargets) => [...prevTargets, response.data]);
            setModalVisible(false);
            Alert.alert('Success', 'Financial target saved successfully!');
        } catch (error) {
            console.error('Error saving financial target:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to save the financial target.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Financial Target Calculator</Text>

            <TextInput
                style={styles.input}
                placeholder="Target Amount ($)"
                keyboardType="numeric"
                value={targetAmount}
                onChangeText={setTargetAmount}
            />

            <TextInput
                style={styles.input}
                placeholder="Current Savings ($)"
                keyboardType="numeric"
                value={currentSavings}
                onChangeText={setCurrentSavings}
            />

            <TextInput
                style={styles.input}
                placeholder="Timeframe (years)"
                keyboardType="numeric"
                value={timeframe}
                onChangeText={setTimeframe}
            />

            <TextInput
                style={styles.input}
                placeholder="Expected Annual Return (%)"
                keyboardType="numeric"
                value={rateOfReturn}
                onChangeText={setRateOfReturn}
            />

            <Button title="Calculate" onPress={calculateContribution} />

            {monthlyContribution !== null && (
                <Text style={styles.result}>
                    {isNaN(monthlyContribution)
                        ? monthlyContribution
                        : `You need to save $${monthlyContribution} per month.`}
                </Text>
            )}

            {monthlyContribution && !isNaN(monthlyContribution) && (
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.saveButtonText}>Save Target</Text>
                </TouchableOpacity>
            )}

            <AddTargetModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={(targetDetails) =>
                    saveTarget({ ...targetDetails, monthlyContribution })
                }
                onAddTarget={saveTarget}
                prefilledData={{
                    targetAmount,
                    currentSavings,
                    monthlyContribution,
                    timeframe
                }}
            />
        </View>
    );
};

export default FinancialTargetScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    result: {
        marginTop: 20,
        fontSize: 18,
        textAlign: 'center',
        color: 'green',
    },
    saveButton: {
        marginTop: 20,
        backgroundColor: '#358B8B',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});