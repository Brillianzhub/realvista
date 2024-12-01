import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const InvoiceGenerator = ({ user, project, quantity, totalAmount }) => {
    const handleSendInvoice = async () => {
        const invoiceData = {
            to: user.email,
            subject: `Invoice for Project: ${project.name}`,
            body: `
                INVOICE
                
                Invoice No: 001234
                Date: ${new Date().toLocaleDateString()}

                BILL TO:
                ${user.name}
                ${user.email}

                FROM:
                Realvista GmbH

                PROJECT DETAILS:
                Project Name: ${project.name}
                Number of Slots Purchased: ${quantity}
                Cost Per Slot: $${project.cost_per_slot}
                Total Amount: $${totalAmount}

                PAYMENT INSTRUCTIONS:
                Bank Name: Commerzbank
                Account Name: Realvista GmbH
                IBAN: DE06 XXXXX XXXXX XXXXX
                Reference: ${user.name || 'Invoice 001234'}

                NOTES:
                - Please ensure payment is made within 7 business days.
                - Bank transfers may take up to 2 working days to process.

                Thank you for trusting Realvista GmbH!
            `,
        };

        try {
            const response = await axios.post('https://www.realvistamanagement.com/order/send-email/', invoiceData);
            if (response.status === 200) {
                alert('Invoice sent successfully to ' + user.email);
            } else {
                alert('Failed to send invoice. Please try again.');
            }
        } catch (error) {
            console.error('Error sending invoice:', error);
            alert('Error sending invoice.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.infoText}>Proceed to payment and receive your invoice via email.</Text>
            <TouchableOpacity onPress={handleSendInvoice} style={styles.button}>
                <Text style={styles.buttonText}>Proceed to Payment</Text>
            </TouchableOpacity>
        </View>
    );
};

export default InvoiceGenerator;

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
