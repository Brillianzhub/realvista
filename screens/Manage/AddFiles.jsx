import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useUserProperty from '../../hooks/useUserProperty';
import { useTheme } from '@/context/ThemeContext';
import { useRoute } from '@react-navigation/native';
import DocumentUploader from '@/components/DocumentUploader';

const AddFiles = () => {
    const route = useRoute();
    const { properties } = useUserProperty();
    const { colors } = useTheme();
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (route.params?.property) {
            setSelectedPropertyId(route.params.property);
        }
    }, [route.params]);

    const filteredProperties = properties.filter((property) => property.group_owner_name === null);

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
                            {filteredProperties.map((property) => (
                                <Picker.Item key={property.id} label={property.title} value={property.id} />
                            ))}
                        </Picker>
                    </View>

                    {selectedPropertyId ? (
                        <>
                            <DocumentUploader propertyId={selectedPropertyId} />
                        </>
                    ) : (
                        <Text style={styles.infoText}>Select a property to add files using the dropdown menu above.</Text>
                    )}
                </>
            )}
        </View>
    );
};

export default AddFiles;

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
