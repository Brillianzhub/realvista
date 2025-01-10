import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import PerformanceScreen from '../../screens/Market/MarketPerformanceScreen';
import ManageListingsScreen from '../../screens/Market/MarketListingScreen';

const Tab = createMaterialTopTabNavigator();


const GroupDashboardScreen = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                lazy: true,
                tabBarStyle: { backgroundColor: '#358B8B' },
                tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
                tabBarIndicatorStyle: { backgroundColor: '#FB902E' },
                tabBarActiveTintColor: '#FB902E',
                tabBarInactiveTintColor: 'white',
            }}
        >
            <Tab.Screen name="Manage Listings" component={ManageListingsScreen} />
            <Tab.Screen name="Performance" component={PerformanceScreen} />
        </Tab.Navigator>
    );
};

export default GroupDashboardScreen;

const styles = StyleSheet.create({});
