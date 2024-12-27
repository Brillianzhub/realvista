import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { TextInput, HelperText, Text, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import * as Yup from 'yup';


const AddExpenseForm = ({ property, onSubmit }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const validationSchema = Yup.object({
        property: Yup.string().required('Property is required'),
        amount: Yup.number().required('Amount is required').positive('Must be positive'),
        description: Yup.string().required('Description is required'),
        date_incurred: Yup.string()
            .required('Date is required')
            .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    });

    const [date, setDate] = useState(new Date());

    return (
        <Formik
            initialValues={{
                property: property?.id || '',
                amount: '',
                description: '',
                date_incurred: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => onSubmit({ ...values, property: property.id })}
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
                    <HelperText type="error" visible={touched.property && errors.property}>
                        {errors.property}
                    </HelperText>
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

                    <TextInput label="Description"
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

                    <Button
                        mode="outlined"
                        onPress={() => setShowDatePicker(true)}
                        style={styles.dateButton}
                    >
                        {values.date_incurred
                            ? `Date: ${values.date_incurred}`
                            : 'Select Date Received'}
                    </Button>
                    <HelperText type="error" visible={touched.date_incurred && errors.date_incurred}>
                        {errors.date_incurred}
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
                                setFieldValue('date_incurred', formattedDate);
                            }}
                        />
                    )}
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

export default AddExpenseForm;
