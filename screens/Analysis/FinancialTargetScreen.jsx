import React from 'react';
import { StyleSheet, View } from 'react-native';
import FinancialTargetForm from '../Analysis/Forms/FinancialTargetForm';

const FinancialTargetScreen = () => {
    return (
        <View style={styles.container}>
            <FinancialTargetForm />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
});

export default FinancialTargetScreen;
