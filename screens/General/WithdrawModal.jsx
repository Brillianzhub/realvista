import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, Keyboard
} from 'react-native';

const WithdrawModal = ({ visible, onClose, onWithdraw, totalEarnings }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const handleWithdraw = () => {
        if (parseFloat(amount) < 5000) {
            setError('Minimum withdrawal amount is NGN 5000.');
            return;
        }
        if (parseFloat(amount) > parseFloat(totalEarnings)) {
            setError('Insufficient earnings for withdrawal.');
            return;
        }
        setError('');
        onWithdraw(amount);
        setAmount('');
        onClose();
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            animationType="fade"
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Withdraw Earnings</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter amount to withdraw"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}
                            <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
                                <Text style={styles.buttonText}>Withdraw</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    withdrawButton: {
        backgroundColor: '#358B8B',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default WithdrawModal;
