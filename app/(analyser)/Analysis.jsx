import { createStackNavigator } from '@react-navigation/stack';
import FinancialAnalysisScreen from '../../screens/Analysis/FinancialAnalysisScreen';
import FinancialTarget from '../../screens/Analysis/FinancialTargetScreen';
import CompoundSavings from '../../screens/Analysis/CompoundSavings';

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
                    title: "Financial Calculators",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#ffffff' },
                    headerTintColor: '#358B8B',
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleBackPress} style={{ paddingLeft: 10 }}>
                            <Ionicons name="arrow-back" size={24} color="#358B8B" />
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
                    headerStyle: { backgroundColor: '#ffffff' },
                    headerTintColor: '#358B8B',
                }}
            />
            <Stack.Screen
                name="CompoundSavings"
                component={CompoundSavings}
                options={{
                    headerShown: true,
                    title: "Compound Savings",
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#ffffff' },
                    headerTintColor: '#358B8B',
                }}
            />
        </Stack.Navigator>
    );
};

export default AnalysisNavigator;
