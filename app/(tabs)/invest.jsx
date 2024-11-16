import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProjectList from '../../screens/ProjectList';
import ProjectDetail from '../../screens/ProjectDetail';

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
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

export default Investment;
