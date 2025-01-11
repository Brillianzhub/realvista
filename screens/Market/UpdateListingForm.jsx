import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import { TextInput, HelperText, RadioButton, Text } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as Location from 'expo-location';


import CurrencyModal from "../../components/CurrencyModal";
import { useCurrency } from '../../context/CurrencyContext';
import CurrencyData from '../../assets/CurrencyData';
import PropertyTypePicker from './PropertyTypePicker';
import AvailabilityPicker from './AvailabilityPicker';


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

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        property_type: Yup.string().required('Property type is required'),
        price: Yup.number()
            .required('Price is required')
            .positive('Price must be positive'),
        currency: Yup.string()
            .required('Currency is required')
            .length(3, 'Currency code must be 3 characters long'),
        listing_purpose: Yup.string().required('Listing purpose is required'),
        address: Yup.string().required('Address is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        zip_code: Yup.string().nullable(),
        availability: Yup.string().required('Availability is required'),
        availability_date: Yup.string()
            .nullable()
            .when('availability', (availability, schema) => {
                return availability === 'date'
                    ? schema.required('Availability date is required')
                    : schema.nullable();
            }),
        bedrooms: Yup.number()
            .nullable()
            .when('property_type', (property_type, schema) =>
                property_type === 'land'
                    ? schema.test('is-null', 'Bedrooms must be null for land', (value) => value == null)
                    : schema.positive('Must be a positive number')
            ),
        bathrooms: Yup.number()
            .nullable()
            .when('property_type', (property_type, schema) =>
                property_type === 'land'
                    ? schema.test('is-null', 'Bathrooms must be null for land', (value) => value == null)
                    : schema.positive('Must be a positive number')
            ),
        square_feet: Yup.number().nullable().positive('Must be a positive number'),
        lot_size: Yup.number().nullable().positive('Must be a positive number'),
        year_built: Yup.number()
            .nullable()
            .min(1800, 'Year must be later than 1800')
            .max(new Date().getFullYear(), 'Year cannot be in the future'),
        coordinate_url: Yup.string().url('Must be a valid URL').nullable(),
        virtual_tour_url: Yup.string().url('Must be a valid URL').nullable(),
    });


    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { currency } = useCurrency();

    const handlePickCoordinates = async (handleChange) => {
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

            // Set the virtual tour URL in Formik field
            handleChange('virtual_tour_url')(googleMapsURL);
        } catch (error) {
            console.error('Location fetching error:', error);
            Alert.alert('Error', 'Could not get location. Please try again.');
        } finally {
            setIsFetchingLocation(false);
        }
    };

    const constructGoogleMapsURL = (coordinates) => {
        // Trim and remove extra spaces
        const cleanedCoordinates = coordinates.replace(/\s+/g, '').trim();
        const isValidCoordinates = /^-?\d{1,2}\.\d+,-?\d{1,3}\.\d+$/.test(cleanedCoordinates);

        if (isValidCoordinates) {
            const [latitude, longitude] = cleanedCoordinates.split(',');
            return `https://www.google.com/maps?q=${latitude},${longitude}`;
        }
        return null; // Return null if invalid
    };


    const handleFormSubmit = (values) => {
        if (values.property_type === 'land') {
            values.bedrooms = null;
            values.bathrooms = null;
            values.year_built = null;
            values.square_feet = null;
        }
        onSubmit(values);
    };


    return (
        <Formik
            initialValues={{
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
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            // onSubmit={onSubmit}
            onSubmit={handleFormSubmit}

        >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
            }) => (
                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    <TextInput
                        label="Title of property"
                        value={values.title}
                        onChangeText={handleChange('title')}
                        onBlur={handleBlur('title')}
                        mode="outlined"
                        style={styles.input}
                        error={touched.title && errors.title}
                    />
                    <HelperText type="error" visible={touched.title && errors.title}>
                        {errors.title}
                    </HelperText>
                    <TextInput
                        label="Description (Optional)"
                        value={values.description}
                        onChangeText={handleChange('description')}
                        onBlur={handleBlur('description')}
                        mode="outlined"
                        style={[styles.input, { height: 120 }]}
                        multiline
                    />

                    <PropertyTypePicker
                        propertyTypes={propertyTypes}
                        values={values}
                        setFieldValue={setFieldValue}
                    />
                    <TextInput
                        label="Price"
                        value={values.price}
                        onChangeText={handleChange('price')}
                        onBlur={handleBlur('price')}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        error={touched.price && errors.price}
                    />
                    <HelperText type="error" visible={touched.price && errors.price}>
                        {errors.price}
                    </HelperText>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                    >
                        <TextInput label="Currency"
                            value={values.currency}
                            onChangeText={handleChange('currency')}
                            onBlur={handleBlur('currency')}
                            mode="outlined"
                            style={[styles.input]}
                            error={touched.currency && errors.currency}
                            editable={isEditable}
                        />
                        <HelperText type="error" visible={touched.currency && errors.currency}>
                            {errors.currency}
                        </HelperText>
                    </TouchableOpacity>
                    <CurrencyModal
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        currencyTypes={currencyOptions}
                        setFieldValue={setFieldValue}
                    />
                    <View style={styles.radioGroup}>
                        <Text>Listing Purpose</Text>
                        <RadioButton.Group
                            onValueChange={(value) => setFieldValue('listing_purpose', value)}
                            value={values.listing_purpose}
                        >
                            {listingPurposeChoices.map((type) => (
                                <View key={type.value} style={styles.radioItem}>
                                    <RadioButton value={type.value} />
                                    <Text>{type.label}</Text>
                                </View>
                            ))}
                        </RadioButton.Group>
                    </View>
                    <AvailabilityPicker
                        values={values}
                        setFieldValue={setFieldValue}
                        touched={touched}
                        errors={errors}
                    />
                    <TextInput
                        label="Address"
                        value={values.address}
                        onChangeText={handleChange('address')}
                        onBlur={handleBlur('address')}
                        mode="outlined"
                        style={styles.input}
                        error={touched.address && errors.address}
                    />
                    <HelperText type="error" visible={touched.address && errors.address}>
                        {errors.address}
                    </HelperText>
                    <TextInput
                        label="State"
                        value={values.state}
                        onChangeText={handleChange('state')}
                        onBlur={handleBlur('state')}
                        mode="outlined"
                        style={styles.input}
                        error={touched.state && errors.state}
                    />
                    <HelperText type="error" visible={touched.state && errors.state}>
                        {errors.state}
                    </HelperText>
                    <TextInput
                        label="City"
                        value={values.city}
                        onChangeText={handleChange('city')}
                        onBlur={handleBlur('city')}
                        mode="outlined"
                        style={styles.input}
                        error={touched.city && errors.city}
                    />
                    <HelperText type="error" visible={touched.city && errors.city}>
                        {errors.city}
                    </HelperText>
                    <TextInput
                        label="Zip Code - Optional"
                        value={values.zip_code}
                        onChangeText={handleChange('zip_code')}
                        onBlur={handleBlur('zip_code')}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        error={touched.zip_code && errors.zip_code}
                    />
                    <HelperText type="error" visible={touched.zip_code && errors.zip_code}>
                        {errors.zip_code}
                    </HelperText>

                    {values.property_type !== 'land' && (
                        <View>
                            <TextInput
                                label="No. of Bedrooms"
                                value={values.bedrooms}
                                onChangeText={handleChange('bedrooms')}
                                onBlur={handleBlur('bedrooms')}
                                mode="outlined"
                                style={styles.input}
                                keyboardType="numeric"
                                error={touched.bedrooms && errors.bedrooms}
                            />
                            <HelperText type="error" visible={touched.bedrooms && errors.bedrooms}>
                                {errors.bedrooms}
                            </HelperText>
                        </View>
                    )}

                    {values.property_type !== 'land' && (
                        <View>
                            <TextInput
                                label="No. of Bathrooms"
                                value={values.bathrooms}
                                onChangeText={handleChange('bathrooms')}
                                onBlur={handleBlur('bathrooms')}
                                mode="outlined"
                                style={styles.input}
                                keyboardType="numeric"
                                error={touched.bathrooms && errors.bathrooms}
                            />
                            <HelperText type="error" visible={touched.bathrooms && errors.bathrooms}>
                                {errors.bathrooms}
                            </HelperText>
                        </View>
                    )}

                    {values.property_type !== 'land' && (
                        <View>
                            <TextInput
                                label="Area (sqm)"
                                value={values.square_feet}
                                onChangeText={handleChange('square_feet')}
                                onBlur={handleBlur('square_feet')}
                                mode="outlined"
                                style={styles.input}
                                keyboardType="numeric"
                                error={touched.square_feet && errors.square_feet}
                            />
                            <HelperText type="error" visible={touched.square_feet && errors.square_feet}>
                                {errors.square_feet}
                            </HelperText>
                        </View>
                    )}
                    <TextInput
                        label="Plot Size (sqm)"
                        value={values.lot_size}
                        onChangeText={handleChange('lot_size')}
                        onBlur={handleBlur('lot_size')}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        error={touched.lot_size && errors.lot_size}
                    />
                    <HelperText type="error" visible={touched.lot_size && errors.lot_size}>
                        {errors.lot_size}
                    </HelperText>
                    {values.property_type !== 'land' && (
                        <View>
                            <TextInput
                                label="Year Built"
                                value={values.year_built}
                                onChangeText={handleChange('year_built')}
                                onBlur={handleBlur('year_built')}
                                mode="outlined"
                                style={styles.input}
                                keyboardType="numeric"
                                error={touched.year_built && errors.year_built}
                            />
                            <HelperText type="error" visible={touched.year_built && errors.year_built}>
                                {errors.year_built}
                            </HelperText>
                        </View>
                    )}
                    <TextInput
                        label="Property Coordinates (Google Coordinates - Optional)"
                        value={values.virtual_tour_url}
                        onChangeText={(text) => {
                            const googleMapsURL = constructGoogleMapsURL(text);
                            setFieldValue('virtual_tour_url', googleMapsURL || text);
                        }}
                        onBlur={handleBlur('virtual_tour_url')}
                        mode="outlined"
                        style={styles.input}
                        placeholder="e.g., 40.7128,-74.0060"
                        error={touched.virtual_tour_url && errors.virtual_tour_url}
                    />
                    <Pressable
                        onPress={() => handlePickCoordinates(handleChange)}
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
                    <HelperText type="error" visible={touched.virtual_tour_url && errors.virtual_tour_url}>
                        {errors.virtual_tour_url}
                    </HelperText>
                    <Pressable mode="contained" onPress={handleSubmit} style={styles.button}>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Update Listing</Text>
                    </Pressable>
                </ScrollView>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    container: {
        // padding: 20,
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginVertical: 10,
        height: 50,
        backgroundColor: '#FB902E',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    radioGroup: {
        marginBottom: 15,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default UpdateListingForm;
