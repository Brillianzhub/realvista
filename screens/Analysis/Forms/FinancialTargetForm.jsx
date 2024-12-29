import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { TextInput, HelperText, RadioButton } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { formatCurrency } from '../../../utils/formatCurrency';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '@/context/GlobalProvider';


const currencyTypes = [
    { label: 'Nigerian Naira', value: 'NGN' },
    { label: 'US Dollar', value: 'USD' },
    { label: 'Euro', value: 'EUR' },
    { label: 'British Pound', value: 'GBP' },
];

const FinancialTargetForm = () => {
    const [monthlyContribution, setMonthlyContribution] = useState(null);

    const { user } = useGlobalContext();

    const validationSchema = Yup.object({
        target_name: Yup.string().required('Target Name is only required to save this target'),
        target_amount: Yup.number().required('Target Amount is required').positive('Must be positive'),
        current_savings: Yup.number().required('Current Savings is required').min(0, 'Cannot be negative'),
        timeframe: Yup.number().required('Timeframe is required').positive('Must be positive'),
        rate_of_return: Yup.number().required('Rate of Return is required').min(0, 'Cannot be negative'),
        currency: Yup.string()
            .oneOf(['USD', 'EUR', 'GBP', 'NGN'], 'Invalid currency')
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


    const handleSaveTarget = async (values, { resetForm }) => {
        try {
            console.log('Request Payload:', values);

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



    return (
        <Formik
            initialValues={{
                target_name: '',
                target_amount: '',
                current_savings: '',
                timeframe: '',
                rate_of_return: '',
                currency: 'NGN',
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
                            <RadioButton.Group
                                onValueChange={(value) => setFieldValue('currency', value)}
                                value={values.currency}
                            >
                                {currencyTypes.map((type) => (
                                    <View key={type.value} style={styles.radioItem}>
                                        <RadioButton value={type.value} />
                                        <Text>{type.label}</Text>
                                    </View>
                                ))}
                            </RadioButton.Group>
                        </View>

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
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    input: { marginBottom: 10 },
    radioGroup: { marginBottom: 15 },
    radioItem: { flexDirection: 'row', alignItems: 'center' },
    result: { marginTop: 20, fontSize: 18, fontWeight: 'bold', color: '#358B8B' },
    submitBtn: { marginTop: 20, backgroundColor: '#FB902E', borderRadius: 8, padding: 10 },
});

export default FinancialTargetForm;
