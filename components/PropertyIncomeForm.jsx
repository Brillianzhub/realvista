import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, HelperText, Text, Menu, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useUserProperty from '../hooks/useUserProperty';

const PropertyIncomeForm = ({ onSubmit }) => {
    const { properties, fetchUserProperties, isLoading } = useUserProperty();
    const [menuVisible, setMenuVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const validationSchema = Yup.object({
        property_id: Yup.string().required('Property is required'),
        amount: Yup.number().required('Amount is required').positive('Must be positive'),
        description: Yup.string().required('Description is required'),
        date_received: Yup.string()
            .required('Date is required')
            .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    });


    const [date, setDate] = useState(new Date()); // Add date state

    if (isLoading) {
        return <Text>Loading properties...</Text>;
    }

    if (!properties.length) {
        return <Text>No properties available. Please add a property first.</Text>;
    }

    return (
        <Formik
            initialValues={{
                property_id: '',
                amount: '',
                description: '',
                date_received: '',
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
                    {/* Property Dropdown */}
                    <View style={styles.dropdownContainer}>
                        <Menu
                            visible={menuVisible}
                            onDismiss={() => setMenuVisible(false)}
                            anchor={
                                <Button
                                    mode="outlined"
                                    onPress={() => setMenuVisible(true)}
                                    style={styles.dropdownButton}
                                >
                                    {values.property_id
                                        ? properties.find((p) => p.id === values.property_id)?.title || 'Select Property'
                                        : 'Select Property'}
                                </Button>
                            }
                        >
                            {properties.map((property) => (
                                <Menu.Item
                                    key={property.id}
                                    title={property.title}
                                    onPress={() => {
                                        setFieldValue('property_id', property.id);
                                        setMenuVisible(false);
                                    }}
                                />
                            ))}
                        </Menu>
                    </View>
                    <HelperText type="error" visible={touched.property_id && errors.property_id}>
                        {errors.property_id}
                    </HelperText>

                    {/* Amount Input */}
                    <TextInput
                        label="Amount"
                        value={values.amount}
                        onChangeText={handleChange('amount')}
                        onBlur={handleBlur('amount')}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        error={touched.amount && errors.amount}
                    />
                    <HelperText type="error" visible={touched.amount && errors.amount}>
                        {errors.amount}
                    </HelperText>

                    {/* Description Input */}
                    <TextInput
                        label="Description"
                        value={values.description}
                        onChangeText={handleChange('description')}
                        onBlur={handleBlur('description')}
                        mode="outlined"
                        style={styles.input}
                        error={touched.description && errors.description}
                    />
                    <HelperText type="error" visible={touched.description && errors.description}>
                        {errors.description}
                    </HelperText>

                    {/* Date Picker */}
                    <Button
                        mode="outlined"
                        onPress={() => setShowDatePicker(true)}
                        style={styles.dateButton}
                    >
                        {values.date_received
                            ? `Date: ${values.date_received}`
                            : 'Select Date Received'}
                    </Button>
                    <HelperText type="error" visible={touched.date_received && errors.date_received}>
                        {errors.date_received}
                    </HelperText>
                    <Text>Selected Date: {date?.toLocaleDateString()}</Text>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : date.toISOString().split('T')[0];
                                setDate(selectedDate || date);
                                setFieldValue('date_received', formattedDate);
                            }}
                        />
                    )}

                    {/* Submit Button */}
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
    dropdownContainer: {
        marginBottom: 15,
    },
    dropdownButton: {
        width: '100%',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    dateButton: {
        marginBottom: 15,
    },
});

export default PropertyIncomeForm;
