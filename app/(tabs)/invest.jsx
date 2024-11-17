import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProjectList from '../../screens/ProjectList';
import ProjectDetail from '../../screens/ProjectDetail';
import InvestmentScreen from '../../screens/InvestmentScreen';
import { Image, TouchableOpacity } from 'react-native';

const Stack = createStackNavigator();

const Investment = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ProjectList"
                component={ProjectList}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ProjectDetail"
                component={ProjectDetail}
                options={({ navigation }) => ({
                    headerShown: true,
                    title: '',
                    headerStyle: {
                        backgroundColor: '#f2f2f2'
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            style={{ marginLeft: 10 }}
                            onPress={() => navigation.goBack()}
                        >
                            <Image
                                source={require('../../assets/images/backArrow.png')}
                                style={{ width: 35, height: 35 }}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    ),

                })}
            />
            <Stack.Screen
                name="InvestmentScreen"
                component={InvestmentScreen}
                options={({ navigation }) => ({
                    headerShown: true,
                    title: '',
                    headerStyle: {
                        backgroundColor: '#f2f2f2'
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            style={{ marginLeft: 10 }}
                            onPress={() => navigation.goBack()}
                        >
                            <Image
                                source={require('../../assets/images/backArrow.png')}
                                style={{ width: 35, height: 35 }}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    ),

                })}
            />
        </Stack.Navigator>
    );
};

export default Investment;
