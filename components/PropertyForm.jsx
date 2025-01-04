import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import { TextInput, HelperText, RadioButton, Text } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as Location from 'expo-location';
import CurrencyData from '../assets/CurrencyData';
import CurrencyModal from "../components/CurrencyModal";
import { useCurrency } from '../context/CurrencyContext';

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

const PropertyForm = ({ onSubmit }) => {
    const validationSchema = Yup.object({
        title: Yup.string()
            .required('Title is required'),
        address: Yup.string()
            .required('Address is required'),
        location: Yup.string()
            .required('Location is required'),
        description: Yup.string()
            .optional(),
        status: Yup.string()
            .oneOf(['available', 'occupied', 'under_maintenance'], 'Invalid status')
            .required('Status is required'),
        property_type: Yup.string()
            .oneOf(['land', 'private', 'commercial', 'residential'], 'Invalid property type')
            .required('Property type is required'),
        year_bought: Yup.number()
            .integer('Year must be an integer')
            .min(1900, 'Year must be no earlier than 1900')
            .max(new Date().getFullYear(), `Year can't be in the future`)
            .optional(),
        area: Yup.number()
            .positive('Area must be positive')
            .optional(),
        num_units: Yup.number()
            .required('Number of units is required')
            .min(1, 'Must be at least 1'),
        initial_cost: Yup.number()
            .required('Initial cost is required')
            .positive('Must be positive'),
        current_value: Yup.number()
            .required('Current value is required')
            .positive('Must be positive'),
        currency: Yup.string()
            .required('Currency is required'),
        virtual_tour_url: Yup.string()
            .optional(),

    });

    const [modalVisible, setModalVisible] = useState(false);

    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

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


    return (
        <Formik
            initialValues={{
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
                currency: `${currency}`,
                virtual_tour_url: '',
                slot_price: null,
                slot_price_current: null,
                total_slots: null,
                user_slots: 0,
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
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
                <ScrollView contentContainerStyle={styles.container}
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
                        label="Location"
                        value={values.location}
                        onChangeText={handleChange('location')}
                        onBlur={handleBlur('location')}
                        mode="outlined"
                        style={styles.input}
                        error={touched.location && errors.location}
                    />
                    <HelperText type="error" visible={touched.location && errors.location}>
                        {errors.location}
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
                    <View style={[styles.radioGroup, { marginTop: 5 }]}>
                        <Text>Status</Text>
                        <RadioButton.Group
                            onValueChange={(value) => setFieldValue('status', value)}
                            value={values.status}
                        >
                            {statusTypes.map((type) => (
                                <View key={type.value} style={styles.radioItem}>
                                    <RadioButton value={type.value} />
                                    <Text>{type.label}</Text>
                                </View>
                            ))}
                        </RadioButton.Group>
                    </View>
                    <View style={styles.radioGroup}>
                        <Text>Property Type</Text>
                        <RadioButton.Group
                            onValueChange={(value) => setFieldValue('property_type', value)}
                            value={values.property_type}
                        >
                            {propertyTypes.map((type) => (
                                <View key={type.value} style={styles.radioItem}>
                                    <RadioButton value={type.value} />
                                    <Text>{type.label}</Text>
                                </View>
                            ))}
                        </RadioButton.Group>
                    </View>

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
                    <TextInput
                        label="Year Bought"
                        value={values.year_bought}
                        onChangeText={handleChange('year_bought')}
                        onBlur={handleBlur('year_bought')}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        error={touched.year_bought && errors.year_bought}
                    />
                    <HelperText type="error" visible={touched.year_bought && errors.year_bought}>
                        {errors.year_bought}
                    </HelperText>
                    <TextInput
                        label="Area (sqm)"
                        value={values.area}
                        onChangeText={handleChange('area')}
                        onBlur={handleBlur('area')}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        error={touched.area && errors.area}
                    />
                    <HelperText type="error" visible={touched.area && errors.area}>
                        {errors.area}
                    </HelperText>
                    <TextInput
                        label="Number of Units"
                        value={values.num_units}
                        onChangeText={handleChange('num_units')}
                        onBlur={handleBlur('num_units')}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        error={touched.num_units && errors.num_units}
                    />
                    <HelperText type="error" visible={touched.num_units && errors.num_units}>
                        {errors.num_units}
                    </HelperText>
                    <TextInput
                        label="Initial Cost"
                        value={values.initial_cost}
                        onChangeText={handleChange('initial_cost')}
                        onBlur={handleBlur('initial_cost')}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        error={touched.initial_cost && errors.initial_cost}
                    />
                    <HelperText type="error" visible={touched.initial_cost && errors.initial_cost}>
                        {errors.initial_cost}
                    </HelperText>
                    <TextInput
                        label="Current Value"
                        value={values.current_value}
                        onChangeText={handleChange('current_value')}
                        onBlur={handleBlur('current_value')}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        error={touched.current_value && errors.current_value}
                    />
                    <HelperText type="error" visible={touched.current_value && errors.current_value}>
                        {errors.current_value}
                    </HelperText>

                    <TextInput
                        label="Virtual Tour URL (Google Coordinates - Optional)"
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
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Submit</Text>
                    </Pressable>
                </ScrollView>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        marginBottom: 5,
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
    currencySelector: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginTop: 5,
    },
});

export default PropertyForm;
