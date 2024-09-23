import React, { useRef } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../(tabs)/home';
import InvestmentScreen from '../(tabs)/invest';
import TrendScreen from '../(tabs)/trend';
import { useTheme } from '@react-navigation/native';
import { DrawerLayout } from 'react-native-gesture-handler';
import NavigationView from '../../lib/NavigationView';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const RealVistaTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        lazy: true,
        tabBarStyle: { backgroundColor: colors.card },
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
        tabBarIndicatorStyle: { backgroundColor: colors.primary },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
      }}
    >
      <Tab.Screen name="Portfolio" component={HomeScreen} />
      <Tab.Screen name="Investment" component={InvestmentScreen} />
      <Tab.Screen name="Trend" component={TrendScreen} />
    </Tab.Navigator>
  );
};

const RealVistaStack = () => {
  const drawerRef = useRef(null);
  const navigationView = NavigationView();

  const openDrawer = () => {
    if (drawerRef.current) {
      drawerRef.current.openDrawer();
    }
  };

  return (
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
            headerTitle: 'RealVista',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity onPress={openDrawer}>
                <Ionicons name="menu" size={24} color="black" style={{ marginLeft: 15 }} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'row', marginRight: 15 }}>
                <TouchableOpacity onPress={() => alert('Notifications')}>
                  <Ionicons name="notifications" size={24} color="black" style={{ marginHorizontal: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => alert('Profile')}>
                  <Ionicons name="person" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
      </Stack.Navigator>
    </DrawerLayout>
  );
};

export default RealVistaStack;
