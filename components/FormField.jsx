import { Text, TextInput, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { icons } from '../constants/';
import { Picker } from '@react-native-picker/picker';


const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, numberOfLines, multiline, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    const propertyTypes = [
        { label: "Land", value: 'land' },
        { label: "Building", value: 'building' },
        { label: "Commercial Property", value: 'commercial' },
        { label: "Residential Property", value: 'residential' }
    ];

    return (
        <View style={[styles.container, otherStyles]}>
            <View style={{marginVertical: 5}}>
                <Text style={styles.label}>{title}</Text>
            </View>
            <View style={styles.inputContainer}>
                {placeholder === 'Property Type' ? (
                    <Picker
                        selectedValue={value}
                        style={styles.picker}
                        onValueChange={(itemValue) => handleChangeText(itemValue)}
                    >
                        {propertyTypes.map((option) => (
                            <Picker.Item key={option.value} label={option.label} value={option.value} />
                        ))}
                    </Picker>
                ) : (
                    <TextInput
                        style={styles.input}
                        value={value}
                        placeholder={placeholder}
                        onChangeText={handleChangeText}
                        multiline={multiline}
                        numberOfLines={numberOfLines}
                        secureTextEntry={title === 'Password' && !showPassword}
                    />
                )}
                {title === 'Password' && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image
                            // source={!showPassword ? icons.eye : icons.eyeHide}
                            style={styles.eyeIcon}
                            resizeMethod="contain"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: '#554d4d',
        fontWeight: '500',
        gap: 10
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        textAlignVertical: 'center',
    },
    picker: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        borderRadius: 50
    },
    eyeIcon: {
        width: 24,
        height: 24,
        marginLeft: 10,
    },
});

export default FormField