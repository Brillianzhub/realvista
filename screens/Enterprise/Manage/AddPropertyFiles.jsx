import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@/context/ThemeContext';
import GroupDocumentUploader from '@/components/GroupDocumentUploader';
import useGroupProperty from '../../../hooks/useGroupProperty';


const AddPropertyFiles = ({ route, navigation }) => {
    const { uniqueGroupId } = route.params;
    const { properties } = useGroupProperty({ uniqueGroupId });

    const { colors } = useTheme();
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (route.params?.property) {
            setSelectedPropertyId(route.params.property);
        }
    }, [route.params]);


    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {isSubmitting ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#358B8B" />
                    <Text style={styles.loadingText}>Saving coordinates...</Text>
                </View>
            ) : (
                <>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedPropertyId}
                            onValueChange={(itemValue) => setSelectedPropertyId(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a property" value={null} />
                            {properties.map((property) => (
                                <Picker.Item key={property.id} label={property.title} value={property.id} />
                            ))}
                        </Picker>
                    </View>

                    {selectedPropertyId ? (
                        <>
                            <GroupDocumentUploader propertyId={selectedPropertyId} />
                        </>
                    ) : (
                        <Text style={styles.infoText}>Select a property to add files using the dropdown menu above.</Text>
                    )}
                </>
            )}
        </View>
    );
};

export default AddPropertyFiles;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
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
        borderWidth: 1,
        borderColor: '#ccc',
    },
    infoText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#358B8B',
    },
});
