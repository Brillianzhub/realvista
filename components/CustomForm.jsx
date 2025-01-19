import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const formatNumber = (value) => {
    if (!value) return;
    const parts = parseFloat(value.replace(/,/g, '')).toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.');
}

const parseNumber = (value) => {
    return value.replace(/,/g, '');
};


const CustomForm = ({
    label = '',
    required = false,
    placeholder,
    keyboardType = 'default',
    value,
    onChangeText,
    error,
    secureTextEntry = false,
    options = null,
    editable = true,
    onValueChange,
    onPress,
    isModal = false,
    multiline = false,
    numberOfLines = 1,
}) => {
    const [formattedValue, setFormattedValue] = useState(formatNumber(value));

    const handleChangeText = (text) => {
        const rawValue = parseNumber(text); // Remove commas
        if (!isNaN(rawValue) || rawValue === '') {
            setFormattedValue(formatNumber(rawValue)); // Update the formatted value
            onChangeText(rawValue); // Pass the raw value to the parent component
        }
    };

    return (
        <View style={styles.container}>
            {label ? (
                <Text style={styles.label}>
                    {label}
                    {required && <Text style={styles.required}>*</Text>}
                </Text>
            ) : null}
            {isModal ? (
                <TouchableOpacity
                    style={[styles.input, styles.modalInput, error && { borderColor: 'red' }]}
                    onPress={onPress}
                >
                    <Text style={{ color: value ? '#000' : '#aaa' }}>
                        {value || placeholder}
                    </Text>
                </TouchableOpacity>
            ) : (
                <TextInput
                    style={[
                        styles.input,
                        { backgroundColor: editable ? '#fff' : '#f0f0f0', color: editable ? '#000' : '#888' },
                        error && { borderColor: 'red' },
                    ]}
                    placeholder={placeholder}
                    // keyboardType={keyboardType}
                    keyboardType={keyboardType === 'numeric' ? 'decimal-pad' : keyboardType}
                    value={value}
                    onChangeText={handleChangeText}
                    // onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    editable={editable}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    textAlignVertical={multiline ? 'top' : 'center'}
                />
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 15,
        color: '#333',
        marginBottom: 4,
    },
    required: {
        color: 'red',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        backgroundColor: '#fff',
        marginBottom: 10
    },
    modalInput: {
        justifyContent: 'center',
    },
    multilineInput: {
        minHeight: 100, // Provide a larger default height for multiline inputs
        textAlignVertical: 'top', // Ensure text starts at the top
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
});

export default CustomForm;
