import { createStackNavigator } from '@react-navigation/stack';
import ManagePropertyScreen from '../../screens/Manage/ManagePropertyScreen';
import AddPropertyScreen from '../../screens/Manage/AddPropertyScreen';
import AddPropertyExpenses from '../../screens/Manage/AddPropertyExpenses';
import AddPropertyIncome from '../../screens/Manage/AddPropertyIncome';
import UpdatePropertyScreen from '../../screens/Manage/UpdatePropertyScreen';
import RemovePropertyScreen from '../../screens/Manage/RemovePropertyScreen';

import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';


const Stack = createStackNavigator();

const ManageNavigator = () => {


    const handleBackPress = () => {
        router.replace('HomeScreen');
    };

    return (
        <Stack.Navigator initialRouteName="ManagePropertyScreen">
            <Stack.Screen
                name="ManageProperty"
                component={ManagePropertyScreen}
                options={{
                    headerShown: true,
                    title: "Manage Property",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleBackPress} style={{ paddingLeft: 10 }}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="AddProperty"
                component={AddPropertyScreen}
                options={{
                    headerShown: true,
                    title: "Add Property",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="AddPropertyExpenses"
                component={AddPropertyExpenses}
                options={{
                    headerShown: true,
                    title: "Add Expenses",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="AddPropertyIncome"
                component={AddPropertyIncome}
                options={{
                    headerShown: true,
                    title: "Add Income",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />

            <Stack.Screen
                name="UpdateProperty"
                component={UpdatePropertyScreen}
                options={{
                    headerShown: true,
                    title: "Update Property",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="RemoveProperty"
                component={RemovePropertyScreen}
                options={{
                    headerShown: true,
                    title: "Delete Property",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
        </Stack.Navigator>
    );
};

export default ManageNavigator;
