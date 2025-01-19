import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Alert, Text } from 'react-native';

import * as Location from 'expo-location';
import CurrencyData from '../../../assets/CurrencyData';
import { useCurrency } from '../../../context/CurrencyContext';
import CurrencyModal from "../../../components/CurrencyModal";
import CustomForm from '@/components/CustomForm';
import CustomRadioButton from '@/components/CustomRadioButton';


const propertyTypes = [
    { label: 'Land', value: 'land' },
    { label: 'Private House', value: 'private' },
    { label: 'Commercial Property', value: 'commercial' },
    { label: 'Residential Property', value: 'residential' },
];

const statusTypes = [
    { label: 'Available', value: 'available' },
    { label: 'Occupied', value: 'occupied' },
    { label: 'Under Maintenance', value: 'under_maintenance' },
];

const currencyOptions = Object.entries(CurrencyData.symbols).map(([key, value]) => ({
    label: `${value} (${key})`,
    value: key,
}))

const GroupPropertyForm = ({ onSubmit }) => {
    const { currency } = useCurrency();

    const [formData, setFormData] = useState({
        title: '',
        address: '',
        location: '',
        description: '',
        status: '',
        property_type: '',
        year_bought: '',
        area: '',
        num_units: 1,
        initial_cost: '',
        current_value: '',
        total_slots: '',
        currency: `${currency}`,
        virtual_tour_url: '',
        slot_price: '',
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData((prevData) => {
            const updatedData = { ...prevData, [field]: value };

            // Dynamically calculate the slot price when total_slots or initial_cost changes
            if (field === 'total_slots' || field === 'initial_cost') {
                const totalSlots = parseFloat(updatedData.total_slots) || 0;
                const initialCost = parseFloat(updatedData.initial_cost) || 0;

                updatedData.slot_price = totalSlots > 0 ? (initialCost / totalSlots).toFixed(2) : '0.00';
            }

            return updatedData;
        });
    };


    const [modalVisible, setModalVisible] = useState(false);

    const [isFetchingLocation, setIsFetchingLocation] = useState(false);


    const validateForm = (formData) => {
        const errors = {};

        if (!formData.title || formData.title.trim() === '') {
            errors.title = 'Title is required';
        }

        if (!formData.address || formData.address.trim() === '') {
            errors.address = 'Address is required';
        }

        if (!formData.location || formData.location.trim() === '') {
            errors.location = 'Location is required';
        }

        if (!['available', 'occupied', 'under_maintenance'].includes(formData.status)) {
            errors.status = 'Invalid status';
        }

        if (!formData.status || formData.status.trim() === '') {
            errors.status = 'Status is required';
        }

        if (!['land', 'private', 'commercial', 'residential'].includes(formData.property_type)) {
            errors.property_type = 'Invalid property type';
        }

        if (!formData.property_type || formData.property_type.trim() === '') {
            errors.property_type = 'Property type is required';
        }

        if (formData.year_bought && (isNaN(formData.year_bought) ||
            formData.year_bought < 1900 ||
            formData.year_bought > new Date().getFullYear())) {
            errors.year_bought = `Year must be between 1900 and ${new Date().getFullYear()}`;
        }

        if (formData.area && formData.area <= 0) {
            errors.area = 'Area must be positive';
        }

        if (!formData.num_units || isNaN(formData.num_units) || formData.num_units < 1) {
            errors.num_units = 'Number of units must be at least 1';
        }

        if (!formData.initial_cost || isNaN(formData.initial_cost) || formData.initial_cost <= 0) {
            errors.initial_cost = 'Initial cost must be a positive number';
        }

        if (!formData.current_value || isNaN(formData.current_value) || formData.current_value <= 0) {
            errors.current_value = 'Current value must be a positive number';
        }

        if (!formData.currency || formData.currency.trim() === '') {
            errors.currency = 'Currency is required';
        }

        return errors;
    };

    const handlePickCoordinates = async () => {
        setIsFetchingLocation(true);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setIsFetchingLocation(false);
            Alert.alert('Permission Denied', 'Location permission is required to fetch coordinates.');
            return;
        }

        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            const { latitude, longitude } = location.coords;
            const googleMapsURL = `https://www.google.com/maps?q=${latitude},${longitude}`;

            setFormData((prevData) => ({
                ...prevData,
                virtual_tour_url: googleMapsURL,
            }));
        } catch (error) {
            console.error('Location fetching error:', error);
            Alert.alert('Error', 'Could not get location. Please try again.');
        } finally {
            setIsFetchingLocation(false);
        }
    };


    const constructGoogleMapsURL = (coordinates) => {
        const cleanedCoordinates = coordinates.replace(/\s+/g, '').trim();
        const isValidCoordinates = /^-?\d{1,2}\.\d+,-?\d{1,3}\.\d+$/.test(cleanedCoordinates);

        if (isValidCoordinates) {
            const [latitude, longitude] = cleanedCoordinates.split(',');
            return `https://www.google.com/maps?q=${latitude},${longitude}`;
        }
        return null;
    };


    const handleSubmit = () => {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
        } else {
            setErrors({});
            onSubmit(formData);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <CustomForm
                label="Title"
                required
                placeholder="Title of property"
                keyboardType="default"
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                error={errors.title}
            />
            <CustomForm
                label="Address"
                required
                placeholder="Address of property"
                keyboardType="default"
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                error={errors.address}
            />
            <CustomForm
                label="Location"
                required
                placeholder="Location of property"
                keyboardType="default"
                value={formData.location}
                onChangeText={(value) => handleInputChange('location', value)}
                error={errors.location}
            />
            <CustomForm
                label="Description"
                placeholder="Description of property"
                keyboardType="default"
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                multiline={true}
                numberOfLines={4}
                error={errors.description}
            />
            <CustomRadioButton
                label="Status"
                required={true}
                options={statusTypes}
                selectedValue={formData.status}
                onValueChange={(value) => {
                    handleInputChange('status', value);
                }}
            />
            <CustomRadioButton
                label="Property type"
                required={true}
                options={propertyTypes}
                selectedValue={formData.property_type}
                onValueChange={(value) => {
                    handleInputChange('property_type', value);
                }}
            />
            <CustomForm
                label="Year bought"
                required
                placeholder="2020"
                keyboardType="numeric"
                value={formData.year_bought}
                onChangeText={(value) => handleInputChange('year_bought', value)}
                error={errors.year_bought}
            />
            <CustomForm
                label="Area (sqm)"
                required
                placeholder="450"
                keyboardType="numeric"
                value={formData.area}
                onChangeText={(value) => handleInputChange('area', value)}
                error={errors.area}
            />
            <CustomForm
                label="Number of units"
                required
                placeholder="1"
                keyboardType="numeric"
                value={formData.num_units}
                onChangeText={(value) => handleInputChange('num_units', value)}
                error={errors.num_units}
            />
            <CustomForm
                label="Currency"
                required
                placeholder="Select a currency"
                value={formData.currency}
                isModal
                error={errors.currency}
                onPress={() => setModalVisible(true)}
            />
            <CurrencyModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                currencyTypes={currencyOptions}
                setFieldValue={handleInputChange}
            />
            <CustomForm
                label="Initial Cost"
                required
                placeholder="Initial cost of property"
                keyboardType="numeric"
                value={formData.initial_cost}
                onChangeText={(value) => handleInputChange('initial_cost', value)}
                error={errors.initial_cost}
            />
            <CustomForm
                label="Current Value"
                required
                placeholder="Current value of property"
                keyboardType="numeric"
                value={formData.current_value}
                onChangeText={(value) => handleInputChange('current_value', value)}
                error={errors.current_value}
            />
            <CustomForm
                label="Total Slots"
                required
                placeholder="Enter total slots"
                keyboardType="numeric"
                value={formData.total_slots}
                onChangeText={(value) => handleInputChange('total_slots', value)}
                error={errors.total_slots}
            />
            <CustomForm
                label="Slot Price"
                required
                placeholder="1000"
                keyboardType="numeric"
                editable={false}
                value={formData.slot_price}
                onChangeText={(value) => handleInputChange('slot_price', value)}
                error={errors.slot_price}
            />
            <CustomForm
                label="Point Coordinate (Google Coordinates)"
                placeholder="e.g., 40.7128,-74.0060"
                value={formData.virtual_tour_url}
                onChangeText={(text) =>
                    setFormData((prevData) => ({ ...prevData, virtual_tour_url: text }))
                }
                error={errors.virtual_tour_url}
            />

            <Pressable
                onPress={handlePickCoordinates}
                disabled={isFetchingLocation}
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: pressed ? '#DDDDDD' : '#358B8B' },
                ]}
            >
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>
                    {isFetchingLocation ? 'Fetching Location...' : 'Pick Coordinates from Phone'}
                </Text>
            </Pressable>
            <Pressable mode="contained" onPress={handleSubmit} style={styles.button}>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Submit</Text>
            </Pressable>

        </ScrollView>
    )
};

export default GroupPropertyForm


const styles = StyleSheet.create({
    disabledInput: {
        backgroundColor: '#f0f0f0',
        color: '#a0a0a0',
    },
    button: {
        marginVertical: 10,
        height: 50,
        backgroundColor: '#FB902E',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    dateButton: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    label: {
        color: '#333',
        fontSize: 16,
        marginBottom: 8,
    },
    radioGroup: {
        flexDirection: 'column',
        marginBottom: 16,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    dot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1.2,
        marginRight: 10,
    },
    selectedDot: {
        borderColor: '#358B8B',
    },
    radioButtonText: {
        fontSize: 15,
        color: '#333',
    },
    selectedRadioButtonText: {
        color: '#358B8B',
    },
});

