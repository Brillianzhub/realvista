import { createStackNavigator } from '@react-navigation/stack';
import CreateEnterpriseScreen from '../../screens/Enterprise/CreateEnterpriseScreen';
import ManageMembersScreen from '../../screens/Enterprise/ManageMembersScreen';
import PropertyListScreen from '../../screens/Enterprise/PropertiesListScreen';
import GroupDashboardScreen from '../../screens/Enterprise/GroupDashboardScreen';
import EnterpriseHomeScreen from '../../screens/Enterprise/EnterpriseHomeScreen';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const Stack = createStackNavigator();

export default function EnterpriseNavigator() {

    const handleBackPress = () => {
        router.replace('Home');
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
        </Stack.Navigator>
    );
}

