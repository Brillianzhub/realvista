import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, Text, Alert } from 'react-native';
import CustomForm from '../../components/CustomForm';
import axios from 'axios';
import { formatCurrency } from '../../utils/formatCurrency';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '@/context/GlobalProvider';
import CurrencyData from '../../assets/CurrencyData';
import CurrencyModal from "../../components/CurrencyModal";
import { useTheme } from '@/context/ThemeContext';
import { useCurrency } from '../../context/CurrencyContext';

const FinancialTargetScreen = () => {
    const { currency } = useCurrency();
    const { colors } = useTheme();

    const { user } = useGlobalContext();

    const [monthlyContribution, setMonthlyContribution] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        target_name: '',
        target_amount: '',
        current_savings: '',
        timeframe: '1',
        rate_of_return: '0',
        currency: `${currency}`
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData((prevData) => ({ ...prevData, [field]: value }));
    };

    const currencyOptions = Object.entries(CurrencyData.symbols).map(([key, value]) => ({
        label: `${value} (${key})`,
        value: key,
    }));

    const validateForm = () => {
        const newErrors = {};
        if (!formData.target_name.trim()) newErrors.target_name = 'Target name is required.';
        if (!formData.target_amount.trim()) newErrors.target_amount = 'Target amount is required.';
        if (!formData.current_savings.trim()) newErrors.current_savings = 'Current savings is required.';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const formatNumberWithCommas = (value) => {
        if (!value) return value;
        const numericValue = value.replace(/[^0-9.]/g, '');
        const [whole, decimal] = numericValue.split('.');
        const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
    };

    const removeCommas = (value) => value.replace(/,/g, '');


    const calculateContribution = (values) => {
        const { target_amount, current_savings, timeframe, rate_of_return } = values;

        if (target_amount && timeframe && rate_of_return !== undefined) {
            const target = parseFloat(target_amount);
            const current = parseFloat(current_savings) || 0;
            const years = parseFloat(timeframe);
            const annualRate = parseFloat(rate_of_return) / 100;

            const periods = years * 12;
            const monthlyRate = annualRate / 12;

            const futureValue = target - current * Math.pow(1 + monthlyRate, periods);

            let contribution;
            if (monthlyRate === 0) {
                contribution = futureValue / periods;
            } else {
                contribution =
                    (futureValue * monthlyRate) / (Math.pow(1 + monthlyRate, periods) - 1);
            }

            setMonthlyContribution(contribution.toFixed(2));
        } else {
            setMonthlyContribution(null);
        }
    };


    useEffect(() => {
        calculateContribution(formData);
    }, [formData]);

    const handleSaveTarget = async () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);

        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found.');
                Alert.alert('Error', 'No authentication token found. Please log in again.');
                setIsSubmitting(false);
                return;
            }

            const payload = {
                ...formData,
                user: user?.id,
            };

            const response = await axios.post(
                'https://www.realvistamanagement.com/analyser/financial-targets/',
                payload,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            Alert.alert('Success', 'Financial Target saved successfully!');

            setFormData({
                target_name: '',
                target_amount: '',
                current_savings: '',
                timeframe: '1',
                rate_of_return: '0',
                currency: `${currency}`,
            });

            setErrors({});
        } catch (error) {
            console.error('Error Response:', error.response?.data);
            Alert.alert(
                'Error',
                error.response?.data
                    ? `Failed to save Financial Target: ${JSON.stringify(error.response.data)}`
                    : 'An unknown error occurred. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <CustomForm
                    label="Target Name"
                    placeholder="Down payment for a house"
                    keyboardType="default"
                    value={formData.target_name}
                    onChangeText={(value) => handleInputChange('target_name', value)}
                    error={errors.target_name}
                />
                <CustomForm
                    label="Target Amount"
                    required
                    placeholder="e.g. 50,000.000.00"
                    keyboardType="numeric"
                    value={formatNumberWithCommas(formData.target_amount)}
                    onChangeText={(value) =>
                        handleInputChange('target_amount', removeCommas(value))
                    }
                    error={errors.target_amount}
                />
                <CustomForm
                    label="Current Savings"
                    required
                    placeholder="e.g. 500,000.00"
                    keyboardType="numeric"
                    value={formatNumberWithCommas(formData.current_savings)}
                    onChangeText={(value) =>
                        handleInputChange('current_savings', removeCommas(value))
                    }
                    error={errors.current_savings}
                />
                <CustomForm
                    label="Time frame (year)"
                    required
                    placeholder="1"
                    keyboardType="numeric"
                    value={formData.timeframe}
                    onChangeText={(value) => handleInputChange('timeframe', value)}
                    error={errors.timeframe}
                />
                <CustomForm
                    label="Rate of Return"
                    placeholder="Enter rate of return"
                    keyboardType="numeric"
                    value={formData.rate_of_return}
                    onChangeText={(value) => handleInputChange('rate_of_return', value)}
                    error={errors.rate_of_return}
                />
                <CustomForm
                    label="Currency"
                    required
                    placeholder="Select a currency"
                    value={formData.currency}
                    isModal
                    error={errors.currency}
                    onPress={() => setModalVisible(true)}
                />
                <CurrencyModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    currencyTypes={currencyOptions}
                    setFieldValue={handleInputChange}
                />

                {monthlyContribution && (
                    <Text style={styles.result}>
                        Minimum monthly contribution: {formatCurrency(monthlyContribution, formData.currency)}
                    </Text>
                )}

                <TouchableOpacity
                    style={[styles.submitBtn, isSubmitting && styles.disabledBtn]}
                    onPress={!isSubmitting ? handleSaveTarget : null}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#358B8B" />
                    ) : (
                        <Text style={styles.submitText}>Save Target</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    scrollContainer: {
        paddingBottom: 16,
    },
    submitBtn: { marginTop: 20, backgroundColor: '#FB902E', borderRadius: 8, padding: 10 },
    result: { marginTop: 20, fontSize: 18, fontWeight: 'bold', color: '#358B8B' },
    submitText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default FinancialTargetScreen;
