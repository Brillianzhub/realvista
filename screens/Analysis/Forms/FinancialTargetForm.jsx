import React, { useEffect, useState } from 'react';
import { useColorScheme, ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { formatCurrency } from '../../../utils/formatCurrency';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '@/context/GlobalProvider';
import CurrencyData from '../../../assets/CurrencyData';
import CurrencyModal from "../../../components/CurrencyModal";
import { useCurrency } from '../../../context/CurrencyContext';

const currencyOptions = Object.entries(CurrencyData.symbols).map(([key, value]) => ({
    label: `${value} (${key})`,
    value: key,
}))

const FinancialTargetForm = () => {
    const [monthlyContribution, setMonthlyContribution] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { currency } = useCurrency();
    const { user } = useGlobalContext();

    const validationSchema = Yup.object({
        target_name: Yup.string().required('Target Name is only required to save this target'),
        target_amount: Yup.number().required('Target Amount is required').positive('Must be positive'),
        current_savings: Yup.number().required('Current Savings is required').min(0, 'Cannot be negative'),
        timeframe: Yup.number().required('Timeframe is required').positive('Must be positive'),
        rate_of_return: Yup.number().required('Rate of Return is required').min(0, 'Cannot be negative'),
        currency: Yup.string()
            .required('Currency is required'),
    });

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

    const colorScheme = useColorScheme();

    const themes = {
        light: {
            background: '#ffffff',
            text: '#000000',
            inputBackground: '#f5f5f5',
            inputText: '#000000',
        },
        dark: {
            background: '#ffffff',
            text: '#ffffff',
            inputBackground: '#f5f5f5',
            inputText: '#ffffff',
        },
    };

    const handleSaveTarget = async (values, { resetForm }) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found.');
                Alert.alert('Error', 'No authentication token found. Please log in again.');
                return;
            }

            const payload = {
                ...values,
                user: user.id,
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
            resetForm();
        } catch (error) {
            console.error('Error Response:', error.response?.data);
            Alert.alert(
                'Error',
                error.response?.data
                    ? `Failed to save Financial Target: ${JSON.stringify(error.response.data)}`
                    : 'An unknown error occurred. Please try again.'
            );
        }
    };

    const currentTheme = themes[colorScheme || 'light'];

    return (
        <View style={[{ flex: 1, backgroundColor: currentTheme.background }]}>
            <Formik
                initialValues={{
                    target_name: '',
                    target_amount: '',
                    current_savings: '',
                    timeframe: '',
                    rate_of_return: '',
                    currency: `${currency}`,
                }}
                validationSchema={validationSchema}
                validateOnChange
                onSubmit={handleSaveTarget}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => {
                    useEffect(() => {
                        calculateContribution(values);
                    }, [values]);

                    return (
                        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                            <TextInput
                                label="Target Name"
                                value={values.target_name}
                                onChangeText={handleChange('target_name')}
                                onBlur={handleBlur('target_name')}
                                mode="outlined"
                                style={styles.input}
                                error={touched.target_name && errors.target_name}
                            />
                            <HelperText type="error" visible={touched.target_name && errors.target_name}>
                                {errors.target_name}
                            </HelperText>
                            <TextInput
                                label="Target Amount"
                                value={values.target_amount}
                                onChangeText={handleChange('target_amount')}
                                onBlur={handleBlur('target_amount')}
                                mode="outlined"
                                keyboardType="numeric"
                                style={styles.input}
                                error={touched.target_amount && errors.target_amount}
                            />
                            <HelperText type="error" visible={touched.target_amount && errors.target_amount}>
                                {errors.target_amount}
                            </HelperText>

                            <TextInput
                                label="Current Savings"
                                value={values.current_savings}
                                onChangeText={handleChange('current_savings')}
                                onBlur={handleBlur('current_savings')}
                                mode="outlined"
                                keyboardType="numeric"
                                style={styles.input}
                                error={touched.current_savings && errors.current_savings}
                            />
                            <HelperText type="error" visible={touched.current_savings && errors.current_savings}>
                                {errors.current_savings}
                            </HelperText>
                            <TextInput
                                label="Timeframe in years"
                                value={values.timeframe}
                                onChangeText={handleChange('timeframe')}
                                onBlur={handleBlur('timeframe')}
                                mode="outlined"
                                keyboardType="numeric"
                                style={styles.input}
                                error={touched.timeframe && errors.timeframe}
                            />
                            <HelperText type="error" visible={touched.timeframe && errors.timeframe}>
                                {errors.timeframe}
                            </HelperText>
                            <TextInput
                                label="Rate of Return (%)"
                                value={values.rate_of_return}
                                onChangeText={handleChange('rate_of_return')}
                                onBlur={handleBlur('rate_of_return')}
                                mode="outlined"
                                keyboardType="numeric"
                                style={styles.input}
                                error={touched.rate_of_return && errors.rate_of_return}
                            />
                            <HelperText type="error" visible={touched.rate_of_return && errors.rate_of_return}>
                                {errors.rate_of_return}
                            </HelperText>

                            <View style={styles.radioGroup}>
                                <Text>Currency</Text>
                                <TouchableOpacity
                                    style={styles.currencySelector}
                                    onPress={() => setModalVisible(true)}
                                >
                                    <Text>{values.currency}</Text>
                                </TouchableOpacity>
                            </View>

                            <CurrencyModal
                                modalVisible={modalVisible}
                                setModalVisible={setModalVisible}
                                currencyTypes={currencyOptions}
                                setFieldValue={setFieldValue}
                            />
                            {monthlyContribution && (
                                <Text style={styles.result}>
                                    Minimum monthly contribution: {formatCurrency(monthlyContribution, values.currency)}
                                </Text>
                            )}
                            <TouchableOpacity
                                style={styles.submitBtn}
                                onPress={handleSubmit}
                            >
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                                    Save Target
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    );
                }}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    input: { marginBottom: 10 },
    radioGroup: { marginBottom: 15 },
    radioItem: { flexDirection: 'row', alignItems: 'center' },
    currencySelector: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginTop: 5,
    },
    result: { marginTop: 20, fontSize: 18, fontWeight: 'bold', color: '#358B8B' },
    submitBtn: { marginTop: 20, backgroundColor: '#FB902E', borderRadius: 8, padding: 10 },
});

export default FinancialTargetForm;
