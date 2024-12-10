import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useUserProperty from '../../hooks/useUserProperty';
import { compareProperties } from '../../utils/compareProperties'; // Assuming this is where the utility function is located

export default function CompareProperties() {
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [comparisonResults, setComparisonResults] = useState(null);
    const { properties } = useUserProperty();

    const handleAddProperty = (propertyId) => {
        if (!selectedProperties.includes(propertyId) && selectedProperties.length < 2) {
            setSelectedProperties([...selectedProperties, propertyId]);
        }
    };

    const handleCompare = () => {
        if (selectedProperties.length < 2) {
            alert('Please select at least two properties to compare.');
            return;
        }
        const selected = properties.filter((property) =>
            selectedProperties.includes(property.id)
        );

        // console.log(selected)
        const results = compareProperties(selected);
        setComparisonResults(results);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Compare Properties</Text>

            {/* Property Picker */}
            <Picker
                selectedValue={null}
                onValueChange={(itemValue) => handleAddProperty(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select a property to add" value={null} />
                {properties.map((property) => (
                    <Picker.Item
                        key={property.id}
                        label={property.title}
                        value={property.id}
                    />
                ))}
            </Picker>

            {/* Selected Properties */}
            <View style={styles.selectedContainer}>
                <Text style={styles.subHeader}>Selected Properties:</Text>
                {selectedProperties.map((propertyId) => {
                    const property = properties.find((p) => p.id === propertyId);
                    return (
                        <Text key={propertyId} style={styles.selectedItem}>
                            {property?.title || 'Unknown Property'}
                        </Text>
                    );
                })}
            </View>

            {/* Compare Button */}
            <Button
                title="Compare"
                onPress={handleCompare}
                disabled={selectedProperties.length < 2}
            />

            {/* Comparison Results */}
            {comparisonResults && (
                <View style={styles.resultsContainer}>
                    <Text style={styles.subHeader}>Comparison Results:</Text>
                    <FlatList
                        data={comparisonResults}
                        keyExtractor={(item) => item.name}
                        renderItem={({ item }) => (
                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>{item.name}</Text>
                                <Text style={styles.resultValue}>
                                    {JSON.stringify(item, null, 2)}
                                </Text>
                            </View>
                        )}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    picker: {
        marginBottom: 16,
    },
    selectedContainer: {
        marginBottom: 16,
    },
    subHeader: {
        fontSize: 16,
        fontWeight: '600',
    },
    selectedItem: {
        fontSize: 14,
        marginVertical: 4,
    },
    resultsContainer: {
        marginTop: 16,
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    resultLabel: {
        fontWeight: 'bold',
    },
    resultValue: {
        fontStyle: 'italic',
    },
});
