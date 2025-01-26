import { Pressable, ScrollView, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomForm from '../components/CustomForm';


const PropertyExpensesForm = ({ property, onSubmit }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [formData, setFormData] = useState({
        property: property?.id || '',
        amount: '',
        currency: property?.currency || 'NGN',
        description: '',
        date_incurred: '',
    });

    const [date, setDate] = useState(new Date());
    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData((prevData) => ({ ...prevData, [field]: value }));
    };

    const formatNumberWithCommas = (value) => {
        if (!value) return value;
        const numericValue = value.replace(/[^0-9.]/g, '');
        const [whole, decimal] = numericValue.split('.');
        const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
    };

    const removeCommas = (value) => value.replace(/,/g, '');

    const validateForm = () => {
        const newErrors = {};

        if (!formData.property) {
            newErrors.property = 'Property is required.';
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
        if (!formData.date_incurred) {
            newErrors.date_incurred = 'Date incurred is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
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
                value={formData.currency}
                error={errors.currency}
                editable={false}
            />
            <CustomForm
                label="Amount"
                required
                placeholder="Amount incurred"
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
                placeholder="Development fee ..."
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
                    {formData.date_incurred ? `Date: ${formData.date_incurred}` : 'Select Date Incurred'}
                </Text>
            </TouchableOpacity>
            {errors.date_incurred && (
                <Text style={styles.errorText}>{errors.date_incurred}</Text>
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
                            handleInputChange('date_incurred', formattedDate);
                        }
                    }}
                />
            )}
            <Pressable
                mode="contained"
                style={styles.button}
                onPress={handleSubmit}
            >
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '400' }}>Submit</Text>
            </Pressable>
        </ScrollView>
    )
}

export default PropertyExpensesForm


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
