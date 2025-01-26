import { Pressable, ScrollView, StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/context/ThemeContext';
import CustomForm from '@/components/CustomForm';

const PropertyIncomeForm = ({ property, onSubmit }) => {

    const { colors } = useTheme();
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [formData, setFormData] = useState({
        property_id: property?.id || '',
        amount: '',
        currency: property?.currency || 'NGN',
        description: '',
        date_received: '',
    });

    const [date, setDate] = useState(new Date());
    const [errors, setErrors] = useState({});


    const formatNumberWithCommas = (value) => {
        if (!value) return value;
        const numericValue = value.replace(/[^0-9.]/g, '');
        const [whole, decimal] = numericValue.split('.');
        const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
    };

    const removeCommas = (value) => value.replace(/,/g, '');

    const handleInputChange = (field, value) => {
        setFormData((prevData) => ({ ...prevData, [field]: value }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.property_id) {
            newErrors.property_id = 'Property is required.';
        }
        if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be a valid positive number.';
        }
        if (!formData.currency) {
            newErrors.currency = 'Currency is required.';
        }
        if (!formData.description) {
            newErrors.description = 'Description is required.';
        }
        if (!formData.date_received) {
            newErrors.date_received = 'Date received is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (property.available_slots > 0) {
            Alert.alert(
                'Submission Declined',
                `There are still ${property.available_slots} available slots. Calculation of member dividends will not be accurate. 
                
    We kindly suggest that you either add the income to the current value of the property using the update page or contact our support team for further assistance. Thank you for your understanding.`
            );
            return;
        }

        if (validateForm()) {
            onSubmit(formData);
        } else {
            Alert.alert('Validation Error', 'Please correct the highlighted fields.');
        }
    };



    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <CustomForm
                label="Currency"
                placeholder="Select a currency"
                value={formData.currency}
                error={errors.currency}
                editable={false}
            />
            <CustomForm
                label="Amount"
                required
                placeholder="Amount received"
                keyboardType="numeric"
                value={formatNumberWithCommas(formData.amount)}
                onChangeText={(value) =>
                    handleInputChange('amount', removeCommas(value))
                }
                error={errors.amount}
            />
            <CustomForm
                label="Description"
                required
                placeholder="Rent income ..."
                keyboardType="default"
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                error={errors.description}
            />
            <TouchableOpacity
                style={[styles.dateButton]}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={styles.buttonText}>
                    {formData.date_received ? `Date: ${formData.date_received}` : 'Select Date Received'}
                </Text>
            </TouchableOpacity>
            {errors.date_received && (
                <Text style={styles.errorText}>{errors.date_received}</Text>
            )}

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);

                        if (selectedDate) {
                            const formattedDate = selectedDate.toISOString().split('T')[0];
                            setDate(selectedDate);
                            handleInputChange('date_received', formattedDate);
                        }
                    }}
                />
            )}
            <Pressable
                mode="contained"
                style={styles.button}
                onPress={handleSubmit}
            >
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Submit</Text>
            </Pressable>
        </ScrollView>
    );
};

export default PropertyIncomeForm;

const styles = StyleSheet.create({
    disabledInput: {
        backgroundColor: '#f0f0f0',
        color: '#a0a0a0',
    },
    button: {
        marginVertical: 10,
        height: 50,
        backgroundColor: '#FB902E',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    dateButton: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
});
