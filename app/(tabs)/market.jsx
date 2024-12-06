import { createStackNavigator } from '@react-navigation/stack';
import MarketScreen from '../../screens/MarketScreen';
import PropertyDetailScreen from '../../screens/PropertyDetailScreen';
import { Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';


const Stack = createStackNavigator();

const AppNavigator = () => {

    // const handleBackPress = () => {
    //     router.replace('/Home');
    // };

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
            // options={{
            //     headerShown: true,
            //     title: "Manage Property",
            //     headerTitleAlign: 'center',
            //     headerLeft: () => (
            //         <TouchableOpacity onPress={handleBackPress}>
            //             <Image
            //                 source={require('../../assets/images/backArrow.png')}
            //                 style={{ width: 35, height: 35 }}
            //                 resizeMode='contain'
            //             />
            //         </TouchableOpacity>
            //     ),
            // }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
