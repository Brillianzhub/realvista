import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../../screens/General/ProfileScreen';
import AboutUsScreen from '../../screens/General/AboutUsScreen';

import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';


const Stack = createStackNavigator();

const GeneralNavigator = () => {

    const handleBackPress = () => {
        router.replace('HomeScreen');
    };

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerShown: true,
                    title: "Profile",
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
                name="AboutUs"
                component={AboutUsScreen}
                options={{
                    headerShown: true,
                    title: "Add Property",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
        </Stack.Navigator>
    );
};

export default GeneralNavigator;
