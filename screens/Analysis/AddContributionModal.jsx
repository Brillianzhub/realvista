import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddContributionModal = ({ visible, onClose, selectedItemId, fetchTarget }) => {
    const [amount, setAmount] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const formatNumberWithCommas = (value) => {
        if (!value) return value;
        const numericValue = value.replace(/[^0-9.]/g, '');
        const [whole, decimal] = numericValue.split('.');
        const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
    };

    const removeCommas = (value) => value.replace(/,/g, '');

    const handleInputChange = (value) => {
        const formattedValue = formatNumberWithCommas(value);
        setAmount(formattedValue);
    };

    const handleAddContribution = async () => {
        if (!amount) {
            Alert.alert('Error', 'Please enter an amount.');
            return;
        }

        const formattedDate = selectedDate.toISOString().split('T')[0];
        const cleanAmount = removeCommas(amount); // Clean amount before submission

        const payload = {
            amount: cleanAmount,
            date: formattedDate,
        };

        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.post(
                `https://www.realvistamanagement.com/analyser/add-contribution/${selectedItemId}/`,
                payload,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201) {
                Alert.alert('Success', 'Contribution added successfully.');
                fetchTarget();
                onClose();
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to add contribution. Please try again.');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add Contribution</Text>

                    {/* Amount Input */}
                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter amount"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={handleInputChange}
                    />

                    {/* Date Selection */}
                    <Text style={styles.label}>Date</Text>
                    <TouchableOpacity
                        style={[styles.input, styles.datePickerButton]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text>
                            {selectedDate ? selectedDate.toISOString().split('T')[0] : 'Select Date'}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                setShowDatePicker(false);
                                if (date) {
                                    setSelectedDate(date);
                                }
                            }}
                        />
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleAddContribution}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
    },
    datePickerButton: {
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default AddContributionModal;
