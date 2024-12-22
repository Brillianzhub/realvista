import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const FinancialAnalysisScreen = () => {
    const navigation = useNavigation();
    return (
        <View>
            <Text>FinancialAnalysisScreen</Text>
            <TouchableOpacity onPress={() => navigation.navigate('FinancialTarget')}>
                <Text>Financial Target</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('TargetList')}>
                <Text>Financial Target List</Text>
            </TouchableOpacity>
        </View>
    )
}

export default FinancialAnalysisScreen

const styles = StyleSheet.create({

})