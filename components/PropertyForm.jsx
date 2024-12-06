import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, HelperText, RadioButton, Text } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

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

const PropertyForm = ({ onSubmit }) => {
    // Validation Schema
    const validationSchema = Yup.object({
        address: Yup.string().required('Address is required'),
        location: Yup.string().required('Location is required'),
        num_units: Yup.number().required('Number of units is required').min(1, 'Must be at least 1'),
        initial_cost: Yup.number().required('Initial cost is required').positive('Must be positive'),
        current_value: Yup.number().required('Current value is required').positive('Must be positive'),
        rental_income: Yup.number().required('Rental income is required').positive('Must be positive'),
        expenses: Yup.number().required('Expenses are required').positive('Must be positive'),
    });

    return (
        <Formik
            initialValues={{
                address: '',
                location: '',
                description: '',
                status: '',
                property_type: '',
                year_bought: '',
                area: '',
                num_units: '',
                initial_cost: '',
                current_value: '',
                rental_income: '',
                expenses: '',
                area_sqm: '',
                virtual_tour_url: '',
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
                <ScrollView contentContainerStyle={styles.container}>
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
                        style={styles.input}
                        multiline
                    />

                    <View style={styles.radioGroup}>
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
                        value={values.area_sqm}
                        onChangeText={handleChange('area_sqm')}
                        onBlur={handleBlur('area_sqm')}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        error={touched.area_sqm && errors.area_sqm}
                    />
                    <HelperText type="error" visible={touched.area_sqm && errors.area_sqm}>
                        {errors.area_sqm}
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
                        label="Rental Income"
                        value={values.rental_income}
                        onChangeText={handleChange('rental_income')}
                        onBlur={handleBlur('rental_income')}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        error={touched.rental_income && errors.rental_income}
                    />
                    <HelperText type="error" visible={touched.rental_income && errors.rental_income}>
                        {errors.rental_income}
                    </HelperText>

                    <TextInput
                        label="Expenses"
                        value={values.expenses}
                        onChangeText={handleChange('expenses')}
                        onBlur={handleBlur('expenses')}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        error={touched.expenses && errors.expenses}
                    />
                    <HelperText type="error" visible={touched.expenses && errors.expenses}>
                        {errors.expenses}
                    </HelperText>

                    <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                        Submit
                    </Button>
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

export default PropertyForm;
