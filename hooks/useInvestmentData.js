import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState } from 'react'

const useInvestmentData = () => {
    const [invetment, setInvestment] = useState([]);

    const fetchInvestmentData = async () => {

    }

    return (
        <View>
            <Text>useInvestmentData</Text>
        </View>
    )
}

export default useInvestmentData

const styles = StyleSheet.create({})