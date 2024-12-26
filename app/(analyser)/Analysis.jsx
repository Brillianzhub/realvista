import { createStackNavigator } from '@react-navigation/stack';
import FinancialAnalysisScreen from '../../screens/Analysis/FinancialAnalysisScreen';
import FinancialTarget from '../../screens/Analysis/FinancialTargetScreen';
import TargetList from '../../screens/Analysis/TargetListScreen'
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';


const Stack = createStackNavigator();

const AnalysisNavigator = () => {

    const handleBackPress = () => {
        router.replace('HomeScreen');
    };

    return (
        <Stack.Navigator initialRouteName="FinancialAnalysisScreen">
            <Stack.Screen
                name="FinancialAnalysisScreen"
                component={FinancialAnalysisScreen}
                options={{
                    headerShown: true,
                    title: "Calculator",
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
                name="FinancialTarget"
                component={FinancialTarget}
                options={{
                    headerShown: true,
                    title: "Financial Target",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="TargetList"
                component={TargetList}
                options={{
                    headerShown: true,
                    title: "Target List",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#358B8B' },
                    headerTintColor: '#fff',
                }}
            />
        </Stack.Navigator>
    );
};

export default AnalysisNavigator;
