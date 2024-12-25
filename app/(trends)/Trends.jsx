import { createStackNavigator } from '@react-navigation/stack';
import TrendsListScreen from '../../screens/Trends/TrendsListScreen';
import TrendDetailScreen from '../../screens/Trends/TrendDetailScreen.jsx';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const Stack = createStackNavigator();

const TrendsNavigator = () => {

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
                    title: "Market Trends",
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
                name="TrendDetails"
                component={TrendDetailScreen}
                options={{
                    headerShown: true,
                    title: "Trend Details",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
        </Stack.Navigator>
    );
};

export default TrendsNavigator;
