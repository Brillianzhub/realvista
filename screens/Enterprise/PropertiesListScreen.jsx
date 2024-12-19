import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PropertyListScreen = ({ route }) => {
    // const { groupId, role } = route.params;

    console.log(route.params)
    return (
        <View>
            <Text>PropertyListScreen</Text>
        </View>
    )
}

export default PropertyListScreen

const styles = StyleSheet.create({})