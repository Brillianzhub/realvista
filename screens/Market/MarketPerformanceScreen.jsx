import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const MarketPerformanceScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Performance Metrics</Text>
            <Text>Views: 120</Text>
            <Text>Inquiries: 25</Text>
            <Text>Highest viewed property: name of propert</Text>
            <Text>Lowest viewed property: 25</Text>
        </View>
    );
}

export default MarketPerformanceScreen

const styles = StyleSheet.create({})

