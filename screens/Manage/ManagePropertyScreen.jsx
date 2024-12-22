import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import { useNavigation } from 'expo-router';

const ManageProperty = () => {

    const navigation = useNavigation();

    const actions = [
        { id: '1', label: 'Add Property', onPress: () => navigation.navigate('AddProperty') },
        { id: '2', label: 'Add Income', onPress: () => navigation.navigate('AddPropertyIncome') },
        { id: '3', label: 'Add Expenses', onPress: () => navigation.navigate('AddPropertyExpenses') },
        { id: '4', label: 'Remove Property', onPress: () => navigation.navigate('RemoveProperty') },
        { id: '5', label: 'Update Property', onPress: () => navigation.navigate('UpdateProperty') },
        { id: '6', label: 'ROI and Cash Flow Analysis', onPress: () => navigation.navigate('/compare_properties') },
        { id: '7', label: 'Invest in Crowd Funding', onPress: () => navigation.navigate('/mutual_invest') },
        { id: '8', label: 'Publish Property for Sale', onPress: () => navigation.navigate('SaleProperty') },
    ];

    const renderAction = ({ item }) => (
        <TouchableOpacity style={styles.box} onPress={item.onPress}>
            <Text style={styles.boxText}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={actions}
                keyExtractor={(item) => item.id}
                renderItem={renderAction}
                numColumns={2}
                contentContainerStyle={styles.grid}
                columnWrapperStyle={styles.row}
            />
        </View>
    );
};

export default ManageProperty;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f7f7f7',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    grid: {
        justifyContent: 'space-between',
    },
    row: {
        justifyContent: 'space-between',
    },
    box: {
        flex: 1,
        height: 120,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#358B8B',
        borderRadius: 8,
    },
    boxText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
