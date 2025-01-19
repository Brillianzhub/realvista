import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomRadioButton = ({ options, selectedValue, onValueChange, label, required }) => {
    return (
        <View style={{ marginBottom: 16 }}>
            {label && (
                <Text style={styles.label}>
                    {label} {required && <Text style={{ color: 'red' }}>*</Text>}
                </Text>
            )}
            <View style={styles.radioGroup}>
                {options.map((item) => (
                    <TouchableOpacity
                        key={item.value}
                        style={[
                            styles.radioButton,
                            selectedValue === item.value && styles.selectedRadioButton,
                        ]}
                        onPress={() => onValueChange(item.value)}
                    >
                        <View
                            style={[
                                styles.dot,
                                selectedValue === item.value && styles.selectedDot,
                            ]}
                        />
                        <Text
                            style={[
                                styles.radioButtonText,
                                selectedValue === item.value && styles.selectedRadioButtonText,
                            ]}
                        >
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    radioGroup: {
        flexDirection: 'column',
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    dot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1.2,
        marginRight: 10,
        borderColor: '#ccc',
    },
    selectedDot: {
        borderColor: '#358B8B',
        // backgroundColor: '#358B8B',
    },
    radioButtonText: {
        fontSize: 15,
        color: '#333',
    },
    selectedRadioButtonText: {
        color: '#358B8B',
    },
});

export default CustomRadioButton;
