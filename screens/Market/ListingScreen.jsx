import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AddPropertyScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add a New Property</Text>
            {/* Add your form logic here */}
        </View>
    );
};

export default AddPropertyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});
