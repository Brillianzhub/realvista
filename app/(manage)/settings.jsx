import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useCurrency } from '../../context/CurrencyContext';

const Settings = () => {
    const { currency, setCurrency } = useCurrency();

    const handleCurrencyChange = (newCurrency) => {
        setCurrency(newCurrency);
        Alert.alert('Currency Updated', `Your preferred currency is now set to ${newCurrency}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Settings</Text>
            <View style={styles.settingItem}>
                <Text style={styles.label}>Preferred Currency</Text>
                <Picker
                    selectedValue={currency}
                    onValueChange={handleCurrencyChange}
                    style={styles.picker}
                >
                    <Picker.Item label="US Dollar (USD)" value="USD" />
                    <Picker.Item label="Euro (EUR)" value="EUR" />
                    <Picker.Item label="British Pound (GBP)" value="GBP" />
                    <Picker.Item label="Japanese Yen (JPY)" value="JPY" />
                    <Picker.Item label="Nigerian Naira (NGN)" value="NGN" />
                </Picker>
            </View>
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    settingItem: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    picker: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 1,
    },
});
