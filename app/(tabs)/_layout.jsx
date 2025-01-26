import React, { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Portfolio from './Portfolio';
import MarketScreen from './market';
import HomeScreen from './HomeScreen';
import { useTheme } from '@react-navigation/native';
import { DrawerLayout } from 'react-native-gesture-handler';
import NavigationView from '../../lib/NavigationView';
import { useGlobalContext } from '@/context/GlobalProvider';
import UserInitials from '@/components/UserInitials';

import { router } from 'expo-router';
import { useNotifications } from '../../context/NotificationContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const RealVistaTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    paddingVertical: 5,
                },
                tabBarLabel: ({ focused }) => (
                    <Text
                        style={[
                            styles.tabLabelText,
                            { color: focused ? '#FB902E' : '#358B8B' },
                        ]}
                    >
                        {route.name}
                    </Text>
                ),
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Portfolio') {
                        iconName = focused ? 'briefcase' : 'briefcase-outline';
                    } else if (route.name === 'Market') {
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                    }

                    return (
                        <View style={styles.iconWrapper}>
                            {focused && <View style={styles.topBar} />}
                            <Ionicons name={iconName} size={24} color={color} />
                        </View>
                    );
                },
                tabBarActiveTintColor: '#FB902E',
                tabBarInactiveTintColor: '#358B8B',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Portfolio" component={Portfolio} />
            <Tab.Screen name="Market" component={MarketScreen} />
        </Tab.Navigator>
    );
};

const RealVistaStack = () => {
    const drawerRef = useRef(null);
    const navigationView = NavigationView();
    const { hasUnread } = useNotifications();
    const { user } = useGlobalContext();

    const openDrawer = () => {
        if (drawerRef.current) {
            drawerRef.current.openDrawer();
        }
    };

    const handleNav = () => {
        router.replace('General');
    };

    const handleNavNot = () => {
        router.replace('Notifications');
    };

    return (
        <React.Fragment>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <DrawerLayout
                ref={drawerRef}
                drawerWidth={300}
                drawerPosition="left"
                renderNavigationView={() => <NavigationView />}
            >
                <Stack.Navigator>
                    <Stack.Screen
                        name="RealVistaTabs"
                        component={RealVistaTabs}
                        options={{
                            headerTitle: 'Realvista',
                            headerTitleAlign: 'center',
                            headerLeft: () => (
                                <TouchableOpacity onPress={openDrawer}>
                                    <Ionicons name="menu" size={30} color="#358B8B" style={{ marginLeft: 15 }} />
                                </TouchableOpacity>
                            ),
                            headerRight: () => (
                                <View style={{ flexDirection: 'row', marginRight: 20 }}>
                                    <TouchableOpacity onPress={handleNavNot}>
                                        <View style={styles.notificationWrapper}>
                                            <Ionicons name="notifications" size={30} color="#358B8B" style={{ marginHorizontal: 10 }} />
                                            {hasUnread && <View style={styles.dot} />}
                                        </View>
                                    </TouchableOpacity>
                                    <UserInitials user={user} onPress={handleNav} />
                                </View>
                            ),
                            headerStyle: {
                                backgroundColor: '#FFFFFF',
                            },
                            headerTitleStyle: {
                                fontSize: 24,
                                color: '#358B8B',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                </Stack.Navigator>
            </DrawerLayout>
        </React.Fragment>
    );
};

export default RealVistaStack;

const styles = StyleSheet.create({
    notificationWrapper: {
        position: 'relative',
    },
    dot: {
        position: 'absolute',
        top: 1,
        right: 30,
        width: 8,
        height: 8,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    tabLabelText: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },

    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    topBar: {
        width: 30,
        height: 3,
        backgroundColor: '#FB902E',
        position: 'absolute',
        top: -10,
        borderRadius: 2,
    }
});
