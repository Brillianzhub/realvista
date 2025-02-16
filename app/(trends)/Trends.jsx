import { createStackNavigator } from '@react-navigation/stack';
import TrendsListScreen from '../../screens/Trends/TrendsListScreen';
import TrendDetailScreen from '../../screens/Trends/TrendDetailScreen.jsx';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from "@/context/ThemeContext";


const Stack = createStackNavigator();

const TrendsNavigator = () => {
    const { colors } = useTheme();

    const handleBackPress = () => {
        router.replace('HomeScreen');
    };

    return (
        <Stack.Navigator initialRouteName="TrendsListScreen">
            <Stack.Screen
                name="TrendsListScreen"
                component={TrendsListScreen}
                options={{
                    headerShown: true,
                    title: "Trends",
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
                name="TrendDetails"
                component={TrendDetailScreen}
                options={{
                    headerShown: true,
                    title: "",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.tint,
                }}
            />
        </Stack.Navigator>
    );
};

export default TrendsNavigator;
