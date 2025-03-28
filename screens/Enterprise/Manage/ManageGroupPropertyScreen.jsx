import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useTheme } from '@/context/ThemeContext'

const ManageGroupPropertyScreen = ({ route, navigation }) => {
    const { uniqueGroupId } = route.params;
    const { colors } = useTheme();

    const handleManageProperty = (action) => {
        navigation.navigate(action, { uniqueGroupId: uniqueGroupId });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => handleManageProperty('AddGroupProperty')}
            >
                <Text style={styles.buttonText}>Add Property</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => handleManageProperty('AddPropertyCoordinate')}
            >
                <Text style={styles.buttonText}>Add Coordinate</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => handleManageProperty('AddPropertyFiles')}
            >
                <Text style={styles.buttonText}>Upload Files/Images</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => handleManageProperty('UpdateGroupProperty')}
            >
                <Text style={styles.buttonText}>Update Property</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => handleManageProperty('AddGroupPropertyIncome')}
            >
                <Text style={styles.buttonText}>Add Property Income</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => handleManageProperty('AddGroupPropertyExpense')}
            >
                <Text style={styles.buttonText}>Add Property Expenses</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => handleManageProperty('RemoveGroupProperty')}
            >
                <Text style={styles.buttonText}>Remove Property</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => handleManageProperty('ManageAllocations')}
            >
                <Text style={styles.buttonText}>Manage Slot Allocations</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
                style={styles.button}
            >
                <Text style={styles.buttonText}>Transfer Slots</Text>
            </TouchableOpacity> */}
        </View>
    );
};

export default ManageGroupPropertyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    button: {
        backgroundColor: '#D9D9D9',
        padding: 15,
        borderRadius: 30,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
    },
});
