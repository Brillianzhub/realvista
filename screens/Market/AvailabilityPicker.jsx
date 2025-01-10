import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { RadioButton, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const AvailabilityPicker = ({ values, setFieldValue, touched, errors }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const availabilityChoices = [
        { label: 'Available Now', value: 'now' },
        { label: 'Available from Specified Date', value: 'date' },
    ];

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false); // Close the picker
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            setFieldValue('availability_date', formattedDate);
        }
    };

    return (
        <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Availability</Text>
            <RadioButton.Group
                onValueChange={(value) => {
                    setFieldValue('availability', value);
                    if (value !== 'date') {
                        setFieldValue('availability_date', null); // Clear date if not 'date'
                    }
                }}
                value={values.availability}
            >
                {availabilityChoices.map((type) => (
                    <View key={type.value} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <RadioButton value={type.value} />
                        <Text>{type.label}</Text>
                    </View>
                ))}
            </RadioButton.Group>

            {values.availability === 'date' && (
                <View style={{ marginTop: 10 }}>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={{
                            padding: 12,
                            borderWidth: 1,
                            borderColor: touched.availability_date && errors.availability_date ? 'red' : '#ccc',
                            borderRadius: 4,
                        }}
                    >
                        <Text>
                            {values.availability_date ? values.availability_date : 'Select a Date'}
                        </Text>
                    </TouchableOpacity>
                    <HelperText
                        type="error"
                        visible={touched.availability_date && errors.availability_date}
                    >
                        {errors.availability_date}
                    </HelperText>

                    {showDatePicker && (
                        <DateTimePicker
                            value={values.availability_date ? new Date(values.availability_date) : new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                </View>
            )}
        </View>
    );
};

export default AvailabilityPicker;
