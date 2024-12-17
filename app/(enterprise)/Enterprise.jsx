import { createStackNavigator } from '@react-navigation/stack';
import CreateEnterpriseScreen from '../../screens/Enterprise/CreateEnterpriseScreen';
import ManageMembersScreen from '../../screens/Enterprise/ManageMembersScreen';
import PropertyListScreen from '../../screens/Enterprise/PropertiesListScreen';
import GroupDashboardScreen from '../../screens/Enterprise/GroupDashboardScreen';
import EnterpriseHomeScreen from '../../screens/Enterprise/EnterpriseHomeScreen';


const Stack = createStackNavigator();

export default function EnterpriseNavigator() {
    return (
        <Stack.Navigator initialRouteName='EnterpriseHomeScreen'>
            <Stack.Screen
                name="EnterpriseHomeScreen"
                component={EnterpriseHomeScreen}
                options={{
                    headerShown: true,
                    title: "Enterprise Home Screen",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="GroupDashboard"
                component={GroupDashboardScreen}
                options={{
                    headerShown: true,
                    title: "Dashboard",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="CreateEnterprise"
                component={CreateEnterpriseScreen}
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

