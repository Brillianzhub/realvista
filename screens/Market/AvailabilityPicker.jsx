import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomRadioButton from '../../components/CustomRadioButton';

const AvailabilityPicker = ({ formData, handleInputChange, errors }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const availabilityChoices = [
        { label: 'Available Now', value: 'now' },
        { label: 'Available from Specified Date', value: 'date' },
    ];

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            handleInputChange('availability_date', formattedDate);
        }
    };

    return (
        <View style={{ marginVertical: 0 }}>
            <CustomRadioButton
                label="Availability"
                required={true}
                options={availabilityChoices}
                selectedValue={formData.availability}
                onValueChange={(value) => {
                    handleInputChange('availability', value);
                    if (value !== 'date') {
                        handleInputChange('availability_date', '');
                    }
                }}
            />

            {formData.availability === 'date' && (
                <View style={{ marginBottom: 20 }}>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={{
                            padding: 12,
                            borderWidth: 1,
                            borderColor: errors.availability_date ? 'red' : '#ccc',
                            borderRadius: 4,
                        }}
                    >
                        <Text>
                            {formData.availability_date ? formData.availability_date : 'Select a Date'}
                        </Text>
                    </TouchableOpacity>
                    {errors.availability_date && (
                        <Text style={{ color: 'red', fontSize: 12 }}>{errors.availability_date}</Text>
                    )}
                </View>
            )}

            {showDatePicker && (
                <DateTimePicker
                    value={formData.availability_date ? new Date(formData.availability_date) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
        </View>
    );
};

export default AvailabilityPicker;
