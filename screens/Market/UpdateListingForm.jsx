import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Alert, TouchableOpacity, Text } from 'react-native';
import * as Location from 'expo-location';
import CustomForm from '../../components/CustomForm';
import CurrencyModal from "../../components/CurrencyModal";
import { useCurrency } from '../../context/CurrencyContext';
import CurrencyData from '../../assets/CurrencyData';
import AvailabilityPicker from './AvailabilityPicker';
import CustomPicker from '../../components/CustomPicker';


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


const currencyOptions = Object.entries(CurrencyData.symbols).map(([key, value]) => ({
    label: `${value} (${key})`,
    value: key,
}))

const listingPurposeChoices = [
    { label: 'For Sale', value: 'sale' },
    { label: 'For Lease', value: 'lease' },
    { label: 'For Rent', value: 'rent' },
];

const UpdateListingForm = ({ property, onSubmit }) => {
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { currency } = useCurrency();

    const [formData, setFormData] = useState({
        property_id: property?.id || '',
        title: property?.title || '',
        description: property?.description || '',
        property_type: property?.property_type || '',
        price: property?.price.toString() || '',
        currency: property?.currency || `${currency}`,
        listing_purpose: property?.listing_purpose || '',
        address: property?.address || '',
        city: property?.city || '',
        state: property?.state || '',
        zip_code: '',
        bedrooms: property?.bedrooms || '',
        bathrooms: property?.bathrooms || '',
        square_feet: property?.square_feet || '',
        lot_size: '',
        year_built: property?.year_built || '',
        availability: '',
        availability_date: '',
        coordinate_url: property?.virtual_tour_url || '',
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData((prevData) => {
            const updatedData = { ...prevData, [field]: value };

            if (field === 'property_type' && value === 'land') {
                updatedData.bedrooms = null;
                updatedData.bathrooms = null;
                updatedData.year_built = null;
                updatedData.square_feet = null
            }

            return updatedData;
        });
    };


    const validateFormData = (data) => {
        const errors = {};

        if (!data.title.trim()) {
            errors.title = 'Title is required.';
        }

        if (!data.description.trim()) {
            errors.description = 'Description is required.';
        }

        if (!data.property_type) {
            errors.property_type = 'Property type is required.';
        }

        if (!data.price || isNaN(data.price) || Number(data.price) <= 0) {
            errors.price = 'Price must be a positive number.';
        }

        if (!data.currency) {
            errors.currency = 'Currency is required.';
        }

        if (!data.listing_purpose) {
            errors.listing_purpose = 'Listing purpose is required.';
        }

        if (!data.address.trim()) {
            errors.address = 'Address is required.';
        }

        if (!data.city.trim()) {
            errors.city = 'City is required.';
        }

        if (!data.state.trim()) {
            errors.state = 'State is required.';
        }

        if (data.property_type !== 'land') {
            if (!data.bedrooms || isNaN(data.bedrooms) || Number(data.bedrooms) < 0) {
                errors.bedrooms = 'Number of bedrooms must be zero or greater.';
            }

            if (!data.bathrooms || isNaN(data.bathrooms) || Number(data.bathrooms) < 0) {
                errors.bathrooms = 'Number of bathrooms must be zero or greater.';
            }
        } else {
            data.bedrooms = null;
            data.bathrooms = null;
        }

        if (data.property_type !== 'land') {
            if (!data.square_feet || isNaN(data.square_feet) || Number(data.square_feet) <= 0) {
                errors.square_feet = 'Area must be a positive number.';
            }
        }

        if (!data.lot_size || isNaN(data.lot_size) || Number(data.lot_size) <= 0) {
            errors.lot_size = 'Plot size must be a positive number.';
        }

        if (data.year_built && (!/^\d{4}$/.test(data.year_built) || Number(data.year_built) > new Date().getFullYear())) {
            errors.year_built = 'Year built must be a valid year.';
        }

        if (!data.availability) {
            errors.availability = 'Availability is required.';
        }

        return errors;
    };

    const formatNumberWithCommas = (value) => {
        if (!value) return value;
        const numericValue = value.replace(/[^0-9.]/g, '');
        const [whole, decimal] = numericValue.split('.');
        const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
    };

    const removeCommas = (value) => value.replace(/,/g, '');

    const handleSubmit = () => {
        let updatedFormData = { ...formData };

        if (updatedFormData.availability === 'now') {
            updatedFormData.availability_date = null;
        }

        const errors = validateFormData(updatedFormData);

        if (Object.keys(errors).length > 0) {
            setErrors(errors);

            const errorMessages = Object.values(errors).join('\n');
            alert(`Please complete the mandatory fields:\n\n${errorMessages}`);
            return;
        }

        setFormData(updatedFormData);

        if (onSubmit) {
            onSubmit(updatedFormData);
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
                label="Description"
                required
                placeholder="Description of property"
                keyboardType="default"
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                error={errors.description}
                multiline={true}
                numberOfLines={4}
            />
            <CustomPicker
                label="Property Type"
                required={true}
                placeholder="Select property type"
                options={propertyTypes}
                selectedValue={formData.property_type}
                onValueChange={(value) => handleInputChange('property_type', value)}
            />

            <CustomForm
                label="Price"
                required
                placeholder="Selling price of property"
                keyboardType="numeric"
                value={formatNumberWithCommas(formData.price)}
                onChangeText={(value) =>
                    handleInputChange('price', removeCommas(value))
                }
                error={errors.price}
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

            <Text style={styles.label}>Purpose of Listing *</Text>

            <View style={styles.radioGroup}>
                {listingPurposeChoices.map((item) => (
                    <TouchableOpacity
                        key={item.value}
                        style={[
                            styles.radioButton,
                            formData.listing_purpose === item.value && styles.selectedRadioButton,
                        ]}
                        onPress={() => handleInputChange('listing_purpose', item.value)}
                    >
                        <View
                            style={[
                                styles.dot,
                                formData.listing_purpose === item.value && styles.selectedDot,
                            ]}
                        />
                        <Text
                            style={[
                                styles.radioButtonText,
                                formData.listing_purpose === item.value && styles.selectedRadioButtonText,
                            ]}
                        >
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
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
                label="City"
                required
                placeholder="City where property is located"
                keyboardType="default"
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                error={errors.city}
            />

            <CustomPicker
                label="State"
                required={true}
                options={statesOfNigeria}
                selectedValue={formData.state}
                placeholder="Choose a state"
                onValueChange={(value) => handleInputChange('state', value)}
            />
            <CustomForm
                label="Postal Code"
                placeholder="000000"
                keyboardType="numeric"
                value={formData.zip_code}
                onChangeText={(value) => handleInputChange('zip_code', value)}
                error={errors.zip_code}
            />
            {formData.property_type !== 'land' && (
                <CustomForm
                    label="Bedrooms"
                    required
                    placeholder="Number of bedrooms"
                    keyboardType="numeric"
                    value={formData.bedrooms}
                    onChangeText={(value) => handleInputChange('bedrooms', value)}
                    error={errors.bedrooms}
                />
            )}
            {formData.property_type !== 'land' && (
                <CustomForm
                    label="Bathrooms"
                    required
                    placeholder="Number of bathrooms"
                    keyboardType="numeric"
                    value={formData.bathrooms}
                    onChangeText={(value) => handleInputChange('bathrooms', value)}
                    error={errors.bathrooms}
                />
            )}
            {formData.property_type !== 'land' && (
                <CustomForm
                    label="Area of property (sqm)"
                    required
                    placeholder="The size of the property"
                    keyboardType="numeric"
                    value={formData.square_feet}
                    onChangeText={(value) => handleInputChange('square_feet', value)}
                    error={errors.square_feet}
                />
            )}
            <CustomForm
                label="Area of plot (sqm)"
                required
                placeholder="Size of the plot"
                keyboardType="numeric"
                value={formData.lot_size}
                onChangeText={(value) => handleInputChange('lot_size', value)}
                error={errors.lot_size}
            />
            {formData.property_type !== 'land' && (
                <CustomForm
                    label="Year Built"
                    required
                    placeholder="e.g. 1998"
                    keyboardType="numeric"
                    value={formData.year_built}
                    onChangeText={(value) => handleInputChange('year_built', value)}
                    error={errors.year_built}
                />
            )}
            <AvailabilityPicker
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
            />

            <Pressable mode="contained" onPress={handleSubmit} style={styles.button}>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '400' }}>Update Listing</Text>
            </Pressable>

        </ScrollView>
    )
}

export default UpdateListingForm

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
        backgroundColor: '#358B8B',
    },
    radioButtonText: {
        fontSize: 15,
        color: '#333',
    },
    selectedRadioButtonText: {
        color: '#358B8B',
    },
});


