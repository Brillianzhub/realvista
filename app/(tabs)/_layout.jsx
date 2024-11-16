import React, { useRef } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './Home';
import TrendScreen from '../(tabs)/trend';
import { useTheme } from '@react-navigation/native';
import { DrawerLayout } from 'react-native-gesture-handler';
import NavigationView from '../../lib/NavigationView';
import Investment from './invest';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const RealVistaTabs = () => {
  const { colors } = useTheme();

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
      <Tab.Screen name="Portfolio" component={HomeScreen} />
      <Tab.Screen name="Investment" component={Investment} />
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

    <React.Fragment>
      <StatusBar
        barStyle="light-content"
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
                  <Ionicons name="menu" size={30} color="white" style={{ marginLeft: 15 }} />
                </TouchableOpacity>
              ),
              headerRight: () => (
                <View style={{ flexDirection: 'row', marginRight: 15 }}>
                  <TouchableOpacity onPress={() => alert('Notifications')}>
                    <Ionicons name="notifications" size={30} color="white" style={{ marginHorizontal: 10 }} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => alert('Profile')}>
                    <Ionicons name="person" size={30} color="white" />
                  </TouchableOpacity>
                </View>
              ),
              headerStyle: {
                backgroundColor: '#358B8B',
              },
              headerTitleStyle: {
                fontSize: 24,
                color: 'white',
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
