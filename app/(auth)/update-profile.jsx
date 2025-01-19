import React, { useState, useEffect } from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useGlobalContext } from '@/context/GlobalProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const UpdateProfile = () => {
    const { theme, toggleTheme, colors } = useTheme();
    const { user, reloadProfile, loading } = useGlobalContext();
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        phone_number: '',
        country_of_residence: '',
        city: '',
        street: '',
        house_number: '',
        postal_code: '',
        birth_date: '',
    });

    useEffect(() => {
        if (user?.profile) {
            setFormData({
                phone_number: user.profile.phone_number || '',
                country_of_residence: user.profile.country_of_residence || '',
                city: user.profile.city || '',
                street: user.profile.street || '',
                house_number: user.profile.house_number || '',
                postal_code: user.profile.postal_code || '',
                birth_date: user.profile.birth_date || '',
            });
        }
    }, [user]);


    const validateForm = () => {
        const newErrors = {};
        if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
        if (!formData.country_of_residence.trim()) newErrors.country_of_residence = 'Country is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.street.trim()) newErrors.street = 'Street is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please fill in all required fields.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('authToken');

            const response = await fetch('https://www.realvistamanagement.com/accounts/profile/update/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                Alert.alert('Error', errorData.message || 'Something went wrong!');
            } else {
                Alert.alert('Success', 'Profile updated successfully!');
                await reloadProfile();
                router.replace('/HomeScreen');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Network error. Please try again later.');
        }
    };


    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>{`${user?.name}'s Profile`}</Text>
                <Text style={styles.label}>
                    Phone Number <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        errors.phone_number && { borderColor: 'red' },
                    ]}
                    placeholder="+2348060473170"
                    keyboardType="phone-pad"
                    value={formData.phone_number}
                    onChangeText={(value) => handleInputChange('phone_number', value)}
                />
                {errors.phone_number && <Text style={styles.errorText}>{errors.phone_number}</Text>}

                <Text style={styles.label}>
                    Country of Residence <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        errors.country_of_residence && { borderColor: 'red' },
                    ]}
                    placeholder="Germany"
                    value={formData.country_of_residence}
                    onChangeText={(value) => handleInputChange('country_of_residence', value)}
                />
                {errors.country_of_residence && (
                    <Text style={styles.errorText}>{errors.country_of_residence}</Text>
                )}

                <Text style={styles.label}>
                    City <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    style={[styles.input, errors.city && { borderColor: 'red' }]}
                    placeholder="Lemgo"
                    value={formData.city}
                    onChangeText={(value) => handleInputChange('city', value)}
                />
                {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

                <Text style={styles.label}>
                    Street <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    style={[styles.input, errors.street && { borderColor: 'red' }]}
                    placeholder="Mittelstrasse"
                    value={formData.street}
                    onChangeText={(value) => handleInputChange('street', value)}
                />
                {errors.street && <Text style={styles.errorText}>{errors.street}</Text>}

                <Text style={styles.label}>House Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="123"
                    value={formData.house_number}
                    onChangeText={(value) => handleInputChange('house_number', value)}
                />

                <Text style={styles.label}>Postal Code</Text>
                <TextInput
                    style={styles.input}
                    placeholder="32657"
                    keyboardType="number-pad"
                    value={formData.postal_code}
                    onChangeText={(value) => handleInputChange('postal_code', value)}
                />

                <Text style={styles.label}>Birth Date</Text>
                <TextInput
                    style={styles.input}
                    placeholder="YEAR-MM-DD"
                    value={formData.birth_date}
                    onChangeText={(value) => handleInputChange('birth_date', value)}
                />
                <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                >
                    <Text style={{ color: 'white' }}>Update Profile</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
        marginBottom: 10,
    },
    submitBtn: {
        backgroundColor: '#FB902E',
        padding: 15,
        marginVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    required: {
        color: 'red',
    },
});

export default UpdateProfile;
