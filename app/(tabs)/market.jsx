import { createStackNavigator } from '@react-navigation/stack';
import MarketScreen from '../../screens/MarketScreen';
import ChatScreen from '../../screens/ChatScreen';
import { Image, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';

const Stack = createStackNavigator();

const Market = () => {
    const navigation = useNavigation();
    const handleBackPress = () => {
        navigation.navigate('MarketScreen');
    };

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MarketScreen"
                component={MarketScreen}
                options={{
                    headerShown: false,
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

export default Market;
