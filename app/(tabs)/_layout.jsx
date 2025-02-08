import React, { useRef } from 'react';
import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNotifications } from '../../context/NotificationContext';
import { DrawerLayout } from 'react-native-gesture-handler';
import { useGlobalContext } from '@/context/GlobalProvider';
import NavigationView from '../../lib/NavigationView';

export default function Layout() {

    const drawerRef = useRef(null);
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
        <>
            <DrawerLayout
                ref={drawerRef}
                drawerWidth={300}
                drawerPosition="left"
                renderNavigationView={() => <NavigationView />}
            >
                <Tabs
                    screenOptions={{
                        tabBarShowLabel: true,
                        headerTitleStyle: {
                            fontFamily: 'RobotoSerif-Regular',
                            color: '#358B8B',
                            fontSize: 22,
                        },
                        tabBarActiveTintColor: '#FB902E',
                        tabBarInactiveTintColor: '#358B8B',
                        tabBarStyle: {
                            backgroundColor: '#FFFFFF',
                            // paddingVertical: 5,
                        },
                        headerLeft: () => (
                            <TouchableOpacity onPress={openDrawer}>
                                <Ionicons name="menu" size={28} color="#358B8B" style={{ marginLeft: 15 }} />
                            </TouchableOpacity>
                        ),
                    }}
                >
                    <Tabs.Screen
                        name="HomeScreen"
                        options={{
                            headerTitle: `Hi, ${user.name}`,
                            tabBarIcon: ({ color, focused }) => (
                                <View style={{ alignItems: 'center' }}>
                                    {focused && <View style={styles.topBorder} />}
                                    <Ionicons name="home-outline" size={24} color={color} />
                                </View>
                            ),
                            tabBarLabel: 'Home',
                            headerRight: () => (
                                <View style={{ flexDirection: 'row', marginRight: 20 }}>
                                    <TouchableOpacity onPress={handleNavNot}>
                                        <View style={styles.iconWrapper}>
                                            <Ionicons name="notifications-outline" size={28} color="#358B8B" />
                                            {hasUnread && <View style={styles.dot} />}
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleNav}>
                                        <View style={styles.iconWrapper}>
                                            <Ionicons name="person-outline" size={28} color="#358B8B" style={{ marginHorizontal: 10 }} />
                                            {hasUnread && <View style={styles.dot} />}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="Portfolio"
                        options={{
                            title: 'Portfolio',
                            headerTitleAlign: 'center',
                            tabBarIcon: ({ color, focused }) => (
                                <View style={{ alignItems: 'center' }}>
                                    {focused && <View style={styles.topBorder} />}
                                    <Ionicons name="briefcase-outline" size={24} color={color} />
                                </View>
                            ),
                            headerRight: () => (
                                <View style={{ flexDirection: 'row', marginRight: 20 }}>
                                    <TouchableOpacity onPress={handleNav}>
                                        <View style={styles.iconWrapper}>
                                            <Ionicons name="person-outline" size={28} color="#358B8B" style={{ marginHorizontal: 10 }} />
                                            {hasUnread && <View style={styles.dot} />}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="Market"
                        options={{
                            title: 'Market',
                            headerTitleAlign: 'center',
                            tabBarIcon: ({ color, focused }) => (
                                <View style={{ alignItems: 'center' }}>
                                    {focused && <View style={styles.topBorder} />}
                                    <Ionicons name="business-outline" size={24} color={color} />
                                </View>
                            ),
                        }}
                    />
                </Tabs>

            </DrawerLayout>
        </>


    );
}

const styles = StyleSheet.create({
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 24,
        height: 24,
    },
    tabLabelText: {
        fontSize: 12,
        textAlign: 'center',
    },
    topBorder: {
        width: 30,
        height: 3,
        backgroundColor: '#FFA001',
        borderRadius: 2,
        position: 'absolute',
        top: -10,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 4,
    },
});
