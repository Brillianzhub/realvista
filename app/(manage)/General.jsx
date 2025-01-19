import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../../screens/General/ProfileScreen';
import AboutUsScreen from '../../screens/General/AboutUsScreen';

import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';



const Stack = createStackNavigator();

const GeneralNavigator = () => {

    const { theme, toggleTheme, colors } = useTheme();

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
                name="AboutUs"
                component={AboutUsScreen}
                options={{
                    headerShown: true,
                    title: "Add Property",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.tint,
                }}
            />
        </Stack.Navigator>
    );
};

export default GeneralNavigator;
