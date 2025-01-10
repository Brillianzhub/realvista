import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropertyExpenseForm from '../Manage/AddExpenseForm';
import { ActivityIndicator } from 'react-native';
import useGroupProperty from '../../../hooks/useGroupProperty';
import { Picker } from '@react-native-picker/picker';
import ManageAllocation from '../../../components/Enterprise/ManageAllocation';


const ManageAllocations = ({ route, navigation }) => {
    const { uniqueGroupId } = route.params;
    const { properties } = useGroupProperty({ uniqueGroupId });
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedProperty = properties.find((property) => property.id === selectedPropertyId);

    return (
        <View style={styles.container}>
            {isSubmitting ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#358B8B" />
                    <Text style={styles.loadingText}>Processing...</Text>
                </View>
            ) : (
                <>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedPropertyId}
                            onValueChange={(itemValue) => setSelectedPropertyId(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a property to view" value={null} />
                            {properties.map((property) => (
                                <Picker.Item key={property.id} label={property.title} value={property.id} />
                            ))}
                        </Picker>
                    </View>

                    {selectedProperty ? (
                        <ManageAllocation property={selectedProperty} />
                    ) : (
                        <Text style={styles.infoText}>Please select a property to view.</Text>
                    )}
                </>
            )}
        </View>
    );
};

export default ManageAllocations;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 10,
        color: '#555',
    },
    pickerContainer: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    infoText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 16,
    },
});
