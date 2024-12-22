import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useGlobalContext } from '@/context/GlobalProvider';


const AddTargetModal = ({ visible, onClose, onAddTarget, prefilledData }) => {
    const [targetName, setTargetName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentSavings, setCurrentSavings] = useState('');
    const [monthlyContribution, setMonthlyContribution] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [timeframe, setTimeframe] = useState(1); // Default timeframe is 1 year
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);

    const { user } = useGlobalContext();

    useEffect(() => {
        if (prefilledData) {
            setTargetAmount(prefilledData.targetAmount?.toString() || '');
            setCurrentSavings(prefilledData.currentSavings?.toString() || '');
            setMonthlyContribution(prefilledData.monthlyContribution?.toString() || '');
            setTimeframe(prefilledData.timeframe || 1);
        }
    }, [prefilledData]);

    useEffect(() => {
        const calculatedEndDate = moment(startDate).add(timeframe, 'years').toDate();
        setEndDate(calculatedEndDate);
    }, [startDate, timeframe]);

    const handleDateChange = (event, selectedDate, isStartDate) => {
        if (event.type === "set" && selectedDate) {
            isStartDate ? setStartDate(selectedDate) : setEndDate(selectedDate);
        }
        isStartDate ? setShowStartDatePicker(false) : setShowEndDatePicker(false);
    };


    const handleAddTarget = () => {
        if (!targetName || !targetAmount || !monthlyContribution || !startDate || !endDate) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        const newTarget = {
            target_name: targetName,
            target_amount: parseFloat(targetAmount),
            current_savings: parseFloat(currentSavings),
            monthly_contribution: parseFloat(monthlyContribution),
            start_date: moment(startDate).format('YYYY-MM-DD'),
            end_date: moment(endDate).format('YYYY-MM-DD'),
            user: user.id,
        };

        onAddTarget(newTarget);
        resetForm();
    };

    const resetForm = () => {
        setTargetName('');
        setTargetAmount('');
        setCurrentSavings('');
        setMonthlyContribution('');
        setStartDate(new Date());
        setEndDate(new Date());
        setTimeframe(1);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalHeader}>Add New Target</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Target Name"
                        value={targetName}
                        onChangeText={setTargetName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Target Amount"
                        value={targetAmount}
                        keyboardType="numeric"
                        onChangeText={(value) => setTargetAmount(value || '')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Current Savings"
                        value={currentSavings}
                        keyboardType="numeric"
                        onChangeText={(value) => setCurrentSavings(value || '')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Monthly Contribution"
                        value={monthlyContribution}
                        keyboardType="numeric"
                        onChangeText={(value) => setMonthlyContribution(value || '')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Timeframe (years)"
                        value={timeframe.toString()}
                        keyboardType="numeric"
                        onChangeText={(value) => setTimeframe(parseInt(value) || 1)}
                    />
                    <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                        <Text style={styles.input}>
                            Start Date: {moment(startDate).format('YYYY-MM-DD')}
                        </Text>
                    </TouchableOpacity>
                    {showStartDatePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={(event, date) => handleDateChange(event, date, true)}
                        />
                    )}

                    {/* End Date is read-only */}
                    <Text style={styles.readOnlyInput}>
                        End Date: {moment(endDate).format('YYYY-MM-DD')}
                    </Text>

                    <View style={styles.modalButtons}>
                        <Button title="Cancel" onPress={onClose} />
                        <Button title="Add Target" onPress={handleAddTarget} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AddTargetModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        elevation: 10,
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    readOnlyInput: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        color: '#555',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
