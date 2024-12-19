import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ChatScreen from '../Enterprise/ChatScreen';
import PropertiesListScreen from '../Enterprise/PropertiesListScreen';
import ManageMembersScreen from '../Enterprise/ManageMembersScreen';

const Tab = createMaterialTopTabNavigator();

const GroupDashboardScreen = ({ route, navigation }) => {
    const { groupId, role } = route.params;

    return (
        <Tab.Navigator
            screenOptions={{
                lazy: true,
                tabBarStyle: {
                    backgroundColor: '#358B8B'
                },
                tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
                tabBarIndicatorStyle: { backgroundColor: '#FB902E' },
                tabBarActiveTintColor: '#FB902E',
                tabBarInactiveTintColor: 'white',
            }}
        >
            <Tab.Screen name="Properties" component={PropertiesListScreen} initialParams={{ groupId, role }} />
            <Tab.Screen name="Members" component={ManageMembersScreen} initialParams={{ groupId, role }} />
            <Tab.Screen name="Chat" component={ChatScreen} initialParams={{ groupId }} />
        </Tab.Navigator>
    );
}

export default GroupDashboardScreen;

const styles = StyleSheet.create({
    tabContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
