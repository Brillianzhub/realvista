import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Alert, TouchableOpacity, Text } from 'react-native';
import CurrencyData from '../assets/CurrencyData';
import CurrencyModal from "../components/CurrencyModal";
import { useCurrency } from '../context/CurrencyContext';
import CustomForm from '../components/CustomForm';
import CustomPicker from '../components/CustomPicker';

const statesOfNigeria = [
    { label: 'Abia', value: 'abia' },
    { label: 'Adamawa', value: 'adamawa' },
    { label: 'Akwa Ibom', value: 'akwa_ibom' },
    { label: 'Anambra', value: 'anambra' },
    { label: 'Bauchi', value: 'bauchi' },
    { label: 'Bayelsa', value: 'bayelsa' },
    { label: 'Benue', value: 'benue' },
    { label: 'Borno', value: 'borno' },
    { label: 'Cross River', value: 'cross_river' },
    { label: 'Delta', value: 'delta' },
    { label: 'Ebonyi', value: 'ebonyi' },
    { label: 'Edo', value: 'edo' },
    { label: 'Ekiti', value: 'ekiti' },
    { label: 'Enugu', value: 'enugu' },
    { label: 'Gombe', value: 'gombe' },
    { label: 'Imo', value: 'imo' },
    { label: 'Jigawa', value: 'jigawa' },
    { label: 'Kaduna', value: 'kaduna' },
    { label: 'Kano', value: 'kano' },
    { label: 'Katsina', value: 'katsina' },
    { label: 'Kebbi', value: 'kebbi' },
    { label: 'Kogi', value: 'kogi' },
    { label: 'Kwara', value: 'kwara' },
    { label: 'Lagos', value: 'lagos' },
    { label: 'Nasarawa', value: 'nasarawa' },
    { label: 'Niger', value: 'niger' },
    { label: 'Ogun', value: 'ogun' },
    { label: 'Ondo', value: 'ondo' },
    { label: 'Osun', value: 'osun' },
    { label: 'Oyo', value: 'oyo' },
    { label: 'Plateau', value: 'plateau' },
    { label: 'Rivers', value: 'rivers' },
    { label: 'Sokoto', value: 'sokoto' },
    { label: 'Taraba', value: 'taraba' },
    { label: 'Yobe', value: 'yobe' },
    { label: 'Zamfara', value: 'zamfara' },
    { label: 'Federal Capital Territory', value: 'fct' },
];


const propertyTypes = [
    { label: 'House', value: 'house' },
    { label: 'Apartment', value: 'apartment' },
    { label: 'Land', value: 'land' },
    { label: 'Commercial Property', value: 'commercial' },
    { label: 'Office Space', value: 'office' },
    { label: 'Warehouse', value: 'warehouse' },
    { label: 'Shop/Store', value: 'shop' },
    { label: 'Duplex', value: 'duplex' },
    { label: 'Bungalow', value: 'bungalow' },
    { label: 'Terrace', value: 'terrace' },
    { label: 'Semi-Detached House', value: 'semi_detached' },
    { label: 'Detached House', value: 'detached' },
    { label: 'Farm Land', value: 'farm_land' },
    { label: 'Industrial Property', value: 'industrial' },
    { label: 'Short Let', value: 'short_let' },
    { label: 'Studio Apartment', value: 'studio' },
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

const PropertyForm = ({ onSubmit }) => {
    const { currency } = useCurrency();

    const [formData, setFormData] = useState({
        title: '',
        address: '',
        location: '',
        city: '',
        zip_code: '',
        description: '',
        status: '',
        property_type: '',
        year_bought: '',
        area: '',
        num_units: 1,
        initial_cost: '',
        current_value: '',
        currency: `${currency}`,
        virtual_tour_url: '',
        slot_price: null,
        slot_price_current: null,
        total_slots: null,
        user_slots: 0,
    });

    const [errors, setErrors] = useState({});

    const formatNumberWithCommas = (value) => {
        if (!value) return value;
        const numericValue = value.replace(/[^0-9.]/g, '');
        const [whole, decimal] = numericValue.split('.');
        const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
    };

    const removeCommas = (value) => value.replace(/,/g, '');


    const handleInputChange = (field, value) => {
        setFormData((prevData) => ({ ...prevData, [field]: value }));
    };

    const [modalVisible, setModalVisible] = useState(false);

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

        if (!formData.city.trim()) {
            errors.city = 'City is required.';
        }

        if (!['available', 'occupied', 'under_maintenance'].includes(formData.status)) {
            errors.status = 'Invalid status';
        }

        if (!formData.status || formData.status.trim() === '') {
            errors.status = 'Status is required';
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
            <CustomPicker
                label="State"
                required={true}
                options={statesOfNigeria}
                selectedValue={formData.location}
                placeholder="Choose a state"
                onValueChange={(value) => handleInputChange('location', value)}
            />
            <CustomForm
                label="City"
                required
                placeholder="City where property is located"
                keyboardType="default"
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                error={errors.city}
            />
            <CustomForm
                label="Postal Code"
                placeholder="000000"
                keyboardType="numeric"
                value={formData.zip_code}
                onChangeText={(value) => handleInputChange('zip_code', value)}
                error={errors.zip_code}
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


            <CustomPicker
                label="Property Type"
                required={true}
                placeholder="Select property type"
                options={propertyTypes}
                selectedValue={formData.property_type}
                onValueChange={(value) => handleInputChange('property_type', value)}
            />

            <Text style={styles.label}>Status <Text style={{ color: 'red' }}>*</Text></Text>

            <View style={styles.radioGroup}>
                {statusTypes.map((item) => (
                    <TouchableOpacity
                        key={item.value}
                        style={[
                            styles.radioButton,
                            formData.status === item.value && styles.selectedRadioButton,
                        ]}
                        onPress={() => handleInputChange('status', item.value)}
                    >
                        <View
                            style={[
                                styles.dot,
                                formData.status === item.value && styles.selectedDot,
                            ]}
                        />
                        <Text
                            style={[
                                styles.radioButtonText,
                                formData.status === item.value && styles.selectedRadioButtonText,
                            ]}
                        >
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <CustomForm
                label="Year bought"
                required
                placeholder="Year property was bought (e.g. 2021)"
                keyboardType="numeric"
                value={formData.year_bought}
                onChangeText={(value) => handleInputChange('year_bought', value)}
                error={errors.year_bought}
            />
            <CustomForm
                label="Area (sqm)"
                required
                placeholder="Area of the property (e.g. 450)"
                keyboardType="numeric"
                value={formData.area}
                onChangeText={(value) => handleInputChange('area', value)}
                error={errors.area}
            />
            <CustomForm
                label="Number of units"
                required
                placeholder="No. of plots for land (e.g. 2)"
                keyboardType="numeric"
                value={formData.num_units}
                onChangeText={(value) => handleInputChange('num_units', value)}
                error={errors.num_units}
            />
            <CustomForm
                label="Initial Cost"
                required
                placeholder="Initial cost of property"
                keyboardType="numeric"
                value={formatNumberWithCommas(formData.initial_cost)}
                onChangeText={(value) =>
                    handleInputChange('initial_cost', removeCommas(value))
                }
                error={errors.initial_cost}
            />
            <CustomForm
                label="Current Value"
                required
                placeholder="Current value of property"
                keyboardType="numeric"
                value={formatNumberWithCommas(formData.current_value)}
                onChangeText={(value) =>
                    handleInputChange('current_value', removeCommas(value))
                }
                error={errors.current_value}
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

            <Pressable mode="contained" onPress={handleSubmit} style={styles.button}>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '400' }}>Save and continue</Text>
            </Pressable>
        </ScrollView>
    )
}

export default PropertyForm


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
        backgroundColor: '#358B8B'
    },
    radioButtonText: {
        fontSize: 15,
        color: '#333',
    },
    selectedRadioButtonText: {
        color: '#358B8B',
    },
});


