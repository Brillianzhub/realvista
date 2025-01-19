import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Alert, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from 'expo-router';
import images from '../../constants/images';


const { width: screenWidth } = Dimensions.get('window');

const dynamicFontSize = screenWidth < 380 ? 12 : 14;

const FinancialAnalysisScreen = () => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const handleComingSoon = () => {
        Alert.alert('Not available', 'This feature is not available yet.')
    }

    const actions = [
        { id: '1', label: 'Savings Target', icon: images.ftarget, onPress: () => navigation.navigate('FinancialTarget') },
        { id: '2', label: 'Compound Savings', icon: images.savings, onPress: () => navigation.navigate('CompoundSavings') },
        { id: '3', label: 'Return on Investment', icon: images.income, onPress: () => handleComingSoon() },
    ];

    const renderAction = ({ item }) => (
        <TouchableOpacity style={styles.box} onPress={item.onPress}>
            <Image source={item.icon} style={styles.iconStyle} />
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
                bounces={true}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
        </View>
    );
};

export default FinancialAnalysisScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
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
        justifyContent: 'flex-start',
        height: 80,
        width: '48%',
        paddingLeft: 10,
        backgroundColor: '#358B8B0D',
        borderRadius: 15,
        margin: 5,
        gap: 10
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
    }
});
