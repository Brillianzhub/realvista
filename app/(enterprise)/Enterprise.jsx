import { createStackNavigator } from '@react-navigation/stack';
import CreateEnterpriseScreen from '../../screens/Enterprise/CreateEnterpriseScreen';
import ManageMembersScreen from '../../screens/Enterprise/ManageMembersScreen';
import PropertyListScreen from '../../screens/Enterprise/PropertiesListScreen';
import GroupDashboardScreen from '../../screens/Enterprise/GroupDashboardScreen';
import EnterpriseHomeScreen from '../../screens/Enterprise/EnterpriseHomeScreen';
import ManageGroupPropertyScreen from '../../screens/Enterprise/Manage/ManageGroupPropertyScreen';

import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AddGroupPropertyScreen from '../../screens/Enterprise/Manage/AddGroupPropertyScreen';
import RemoveGroupProperty from '../../screens/Enterprise/Manage/RemoveGroupProperty';
import UpdateGroupProperty from '../../screens/Enterprise/Manage/UpdateGroupProperty';
import AddGroupPropertyIncome from '../../screens/Enterprise/Manage/AddGroupPropertyIncome';
import AddGroupPropertyExpense from '../../screens/Enterprise/Manage/AddGroupPropertyExpense';
import ManageAllocations from '../../screens/Enterprise/Manage/ManageAllocations';
import AddPropertyCoordinate from '../../screens/Enterprise/Manage/AddPropertyCoordinate';
import AddPropertyFiles from '../../screens/Enterprise/Manage/AddPropertyFiles';
import ReleasedSlots from '../../screens/Enterprise/Order/ReleasedSlots';


import { useTheme } from '@/context/ThemeContext';


const Stack = createStackNavigator();

export default function EnterpriseNavigator() {
    const { colors } = useTheme();
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
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.tint,
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleBackPress} style={{ paddingLeft: 10 }}>
                            <Ionicons name="arrow-back" size={24} color={colors.tint} />
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
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.tint,
                }}
            />
            <Stack.Screen
                name="CreateEnterprise"
                component={CreateEnterpriseScreen}
                options={{
                    headerShown: true,
                    title: "Create New Group",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.tint,
                }}
            />
            <Stack.Screen
                name="ManageMembers"
                component={ManageMembersScreen}
            />
            <Stack.Screen
                name="ReleasedSlots"
                component={ReleasedSlots}
                options={{
                    headerShown: true,
                    title: "Released Slots",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.tint,
                }}
            />
            <Stack.Screen
                name="PropertyList"
                component={PropertyListScreen}
            />
            <Stack.Screen
                name="ManageGroupProperty"
                component={ManageGroupPropertyScreen}
                options={{
                    headerShown: true,
                    title: "Manage Group Property",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.tint,
                }}
            />
            <Stack.Screen
                name="AddGroupProperty"
                component={AddGroupPropertyScreen}
                options={{
                    headerShown: true,
                    title: "Add Group Property",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.tint,
                }}
            />
            <Stack.Screen
                name="AddPropertyCoordinate"
                component={AddPropertyCoordinate}
                options={{
                    headerShown: true,
                    title: "Add Coordinate",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.tint,
                }}
            />
            <Stack.Screen
                name="AddPropertyFiles"
                component={AddPropertyFiles}
                options={{
                    headerShown: true,
                    title: "Upload Files/Images",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.tint,
                }}
            />
            <Stack.Screen
                name="RemoveGroupProperty"
                component={RemoveGroupProperty}
                options={{
                    headerShown: true,
                    title: "Remove Group Property",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.tint,
                }}
            />
            <Stack.Screen
                name="UpdateGroupProperty"
                component={UpdateGroupProperty}
                options={{
                    headerShown: true,
                    title: "Update Group Property",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.tint,
                }}
            />
            <Stack.Screen
                name="AddGroupPropertyIncome"
                component={AddGroupPropertyIncome}
                options={{
                    headerShown: true,
                    title: "Add Group Property Income",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.tint,
                }}
            />
            <Stack.Screen
                name="AddGroupPropertyExpense"
                component={AddGroupPropertyExpense}
                options={{
                    headerShown: true,
                    title: "Add Group Property Expense",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.tint,
                }}
            />
            <Stack.Screen
                name="ManageAllocations"
                component={ManageAllocations}
                options={{
                    headerShown: true,
                    title: "Manage Allocations",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.tint,
                }}
            />
        </Stack.Navigator>
    );
}

