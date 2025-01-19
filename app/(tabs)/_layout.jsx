import React, { useRef } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
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

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const RealVistaTabs = () => {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        lazy: true,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 10,
        },
        tabBarLabel: ({ focused }) => (
          <View
            style={[
              styles.tabLabelContainer,
              focused && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabLabelText,
                { color: focused ? '#FFFFFF' : '#358B8B' },
              ]}
            >
              {route.name}
            </Text>
          </View>
        ),
        tabBarIndicatorStyle: { height: 0 },
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
    router.replace('General')
  }

  const handleNavNot = () => {
    router.replace('Notifications')
  }

  return (

    <React.Fragment>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />
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
                  <UserInitials
                    user={user}
                    onPress={handleNav}
                  />
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

  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#358B8B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  tabLabelContainer: {
    borderRadius: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#FB902E',
  },
  tabLabelText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});