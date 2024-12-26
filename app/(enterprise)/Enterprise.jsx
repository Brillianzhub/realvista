import { createStackNavigator } from '@react-navigation/stack';
import CreateEnterpriseScreen from '../../screens/Enterprise/CreateEnterpriseScreen';
import ManageMembersScreen from '../../screens/Enterprise/ManageMembersScreen';
import PropertyListScreen from '../../screens/Enterprise/PropertiesListScreen';
import GroupDashboardScreen from '../../screens/Enterprise/GroupDashboardScreen';
import EnterpriseHomeScreen from '../../screens/Enterprise/EnterpriseHomeScreen';
import ManageBooking from '../../screens/Enterprise/ManageBooking';
import ManageGroupPropertyScreen from '../../screens/Enterprise/Manage/ManageGroupPropertyScreen';


import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AddGroupPropertyScreen from '../../screens/Enterprise/Manage/AddGroupPropertyScreen';
import RemoveGroupProperty from '../../screens/Enterprise/Manage/RemoveGroupProperty';
import UpdateGroupProperty from '../../screens/Enterprise/Manage/UpdateGroupProperty';
import AddGroupPropertyIncome from '../../screens/Enterprise/Manage/AddGroupPropertyIncome';
import AddGroupPropertyExpense from '../../screens/Enterprise/Manage/AddGroupPropertyExpense';


const Stack = createStackNavigator();

export default function EnterpriseNavigator() {

    const handleBackPress = () => {
        router.replace('HomeScreen');
    };

    return (
        <Stack.Navigator initialRouteName='EnterpriseHomeScreen'>
            <Stack.Screen
                name="EnterpriseHomeScreen"
                component={EnterpriseHomeScreen}
                options={{
                    headerShown: true,
                    title: "My Groups",
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
                name="GroupDashboard"
                component={GroupDashboardScreen}
                options={{
                    headerShown: true,
                    title: "Group Information",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="CreateEnterprise"
                component={CreateEnterpriseScreen}
                options={{
                    headerShown: true,
                    title: "Create New Group",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="ManageMembers"
                component={ManageMembersScreen}
            />
            <Stack.Screen
                name="PropertyList"
                component={PropertyListScreen}
            />
            <Stack.Screen
                name="ManageBooking"
                component={ManageBooking}
                options={{
                    headerShown: true,
                    title: "Members Booking",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="ManageGroupProperty"
                component={ManageGroupPropertyScreen}
                options={{
                    headerShown: true,
                    title: "Manage Group Property",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="AddGroupProperty"
                component={AddGroupPropertyScreen}
                options={{
                    headerShown: true,
                    title: "Add Group Property",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="RemoveGroupProperty"
                component={RemoveGroupProperty}
                options={{
                    headerShown: true,
                    title: "Remove Group Property",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="UpdateGroupProperty"
                component={UpdateGroupProperty}
                options={{
                    headerShown: true,
                    title: "Update Group Property",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="AddGroupPropertyIncome"
                component={AddGroupPropertyIncome}
                options={{
                    headerShown: true,
                    title: "Add Group Property Income",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="AddGroupPropertyExpense"
                component={AddGroupPropertyExpense}
                options={{
                    headerShown: true,
                    title: "Add Group Property Expense",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
        </Stack.Navigator>
    );
}

