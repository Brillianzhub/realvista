import { createStackNavigator } from '@react-navigation/stack';
import MarketScreen from '../../screens/MarketScreen';
import PropertyDetailScreen from '../../screens/PropertyDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="MarketScreen">
            <Stack.Screen
                name="MarketScreen"
                component={MarketScreen}
            />
            <Stack.Screen
                name="PropertyDetail"
                component={PropertyDetailScreen}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
