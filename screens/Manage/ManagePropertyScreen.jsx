import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { router, useNavigation } from 'expo-router';
import images from '../../constants/images';

const ManageProperty = () => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);

    const actions = [
        { id: '1', label: 'Add Property', icon: images.add, onPress: () => navigation.navigate('AddProperty') },
        { id: '2', label: 'Add Income', icon: images.income, onPress: () => navigation.navigate('AddPropertyIncome') },
        { id: '3', label: 'Add Expenses', icon: images.expense, onPress: () => navigation.navigate('AddPropertyExpenses') },
        { id: '4', label: 'Remove Property', icon: images.remove, onPress: () => navigation.navigate('RemoveProperty') },
        { id: '5', label: 'Update Property', icon: images.update, onPress: () => navigation.navigate('UpdateProperty') },
        { id: '6', label: 'List for Sale', icon: images.sale, onPress: () => router.replace('MarketListing') },
        { id: '7', label: 'Target List', icon: images.ftarget, onPress: () => navigation.navigate('TargetList') },
    ];

    const renderAction = ({ item }) => (
        <TouchableOpacity style={styles.box} onPress={item.onPress}>
            <Image source={item.icon} style={styles.iconStyle} />
            <Text style={styles.boxText}>{item.label}</Text>
        </TouchableOpacity>
    );

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={actions}
                keyExtractor={(item) => item.id}
                renderItem={renderAction}
                numColumns={2}
                contentContainerStyle={styles.grid}
                columnWrapperStyle={styles.row}
                bounces={true}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
        </View>
    );
};

export default ManageProperty;


const { width: screenWidth } = Dimensions.get('window');

const dynamicFontSize = screenWidth < 380 ? 12 : 14;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    grid: {
        justifyContent: 'space-between',
    },
    row: {
        justifyContent: 'space-between',
    },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        width: '48%',
        paddingLeft: 15,
        backgroundColor: '#358B8B0D',
        borderRadius: 15,
        margin: 5,
        gap: 5
    },
    boxText: {
        flex: 1,
        color: '#358B8B',
        fontSize: dynamicFontSize,
        textAlign: 'left',
    },
    iconStyle: {
        height: 24,
        width: 24,
    },
});
