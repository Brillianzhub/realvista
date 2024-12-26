import { createStackNavigator } from '@react-navigation/stack';
import MarketScreen from '../../screens/MarketScreen';
import PropertyDetailScreen from '../../screens/PropertyDetailScreen';
import ChatScreen from '../../screens/ChatScreen';
import { Image, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';


const Stack = createStackNavigator();

const AppNavigator = () => {
    const navigation = useNavigation();
    const handleBackPress = () => {
        navigation.navigate('MarketScreen');
    };

    return (
        <Stack.Navigator initialRouteName="MarketScreen">
            <Stack.Screen
                name="MarketScreen"
                component={MarketScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="PropertyDetail"
                component={PropertyDetailScreen}
                options={{
                    headerShown: true,
                    title: "Property Details",
                    headerTitleAlign: 'center',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={handleBackPress}
                            style={{ paddingLeft: 15 }}
                        >
                            <Image
                                source={require('../../assets/images/backArrow.png')}
                                style={{ width: 35, height: 35 }}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{
                    headerShown: true,
                    title: "Chat",
                    headerTitleAlign: 'center',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={handleBackPress}
                            style={{ paddingLeft: 15 }}
                        >
                            <Image
                                source={require('../../assets/images/backArrow.png')}
                                style={{ width: 35, height: 35 }}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    ),
                }}
            />

        </Stack.Navigator>
    );
};

export default AppNavigator;
