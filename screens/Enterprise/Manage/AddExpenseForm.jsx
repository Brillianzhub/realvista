import { Pressable, ScrollView, StyleSheet, TouchableOpacity, Text, Alert, View } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomForm from '@/components/CustomForm';

const AddExpenseForm = ({ property, onSubmit }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [formData, setFormData] = useState({
        property_id: property?.id || '',
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
        if (!formData.date_incurred) {
            newErrors.date_incurred = 'Date incurred is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (property.available_slots > 0) {
            Alert.alert(
                'Submission Declined',
                `There are still ${property.available_slots} available slots. Calculation of member shares of expenses will not be accurate. 
                
    We kindly suggest that you either add the expenses to the initial value of the property using the update page or contact our support team for further assistance. Thank you for your understanding.`
            );
            return; // Prevent form submission
        }

        // Proceed with validation and submission
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
                value={formData.amount}
                onChangeText={(value) => handleInputChange('amount', value)}
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
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Submit</Text>
            </Pressable>
        </ScrollView>
    )
}

export default AddExpenseForm

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
