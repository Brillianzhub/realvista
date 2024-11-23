import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useState } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';


const useInvestmentData = () => {
    const { user } = useGlobalContext();
    const [invetment, setInvestment] = useState([]);

    return (
        <View>
            <Text>useInvestmentData</Text>
        </View>
    )
}

export default useInvestmentData

const styles = StyleSheet.create({})