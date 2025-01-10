import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';

const PropertyTypePicker = ({ propertyTypes, values, setFieldValue }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (value) => {
        setFieldValue('property_type', value);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text>Property Type</Text>
            <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setModalVisible(true)}
            >
                <Text>
                    {values.property_type
                        ? propertyTypes.find((type) => type.value === values.property_type)?.label
                        : 'Select Property Type'}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Property Type</Text>
                        <FlatList
                            data={propertyTypes}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => handleSelect(item.value)}
                                >
                                    <Text>{item.label}</Text>
                                    {values.property_type === item.value && (
                                        <RadioButton value={item.value} status="checked" />
                                    )}
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default PropertyTypePicker;

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    pickerButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 4,
        marginTop: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    closeButton: {
        backgroundColor: '#FB902E',
        padding: 12,
        borderRadius: 4,
        marginTop: 16,
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
});
