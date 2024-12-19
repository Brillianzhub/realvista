import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { TouchableOpacity } from 'react-native';

const CreateEnterpriseScreen = ({ navigation }) => {

    const [loading, setLoading] = useState(false);

    const initialValues = {
        name: '',
        description: '',
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Group name is required.'),
        description: Yup.string(),
    });


    const handleCreateGroup = async (values, { setSubmitting, resetForm }) => {
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('authToken');

            if (!token) {
                throw new Error('Authentication token is missing.');
            }

            // Send POST request
            const response = await axios.post(
                `https://www.realvistamanagement.com/enterprise/create-group/`,
                {
                    name: values.name,
                    description: values.description,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201) {
                Alert.alert('Success', 'Group created successfully!\n\nYou will be redirected to My Groups page. If you do not see your new group, try to refersh the page.');
                resetForm();
                navigation.navigate('EnterpriseHomeScreen')
            } else {
                Alert.alert('Error', response.data?.error || 'Failed to create group.');
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'An error occurred. Please try again.';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleCreateGroup}
        >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
            }) => (
                <View style={styles.container}>
                    <TextInput
                        placeholder="Group Name"
                        value={values.name}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        style={[
                            styles.input,
                            touched.name && errors.name ? styles.inputError : null,
                        ]}
                    />
                    {touched.name && errors.name && (
                        <Text style={styles.errorText}>{errors.name}</Text>
                    )}

                    <TextInput
                        placeholder="Description (optional)"
                        value={values.description}
                        onChangeText={handleChange('description')}
                        onBlur={handleBlur('description')}
                        style={styles.input}
                    />

                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>Creating...</Text>
                        ) : (
                            <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>Create Group</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </Formik>
    );
}

export default CreateEnterpriseScreen


const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        // justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    submitBtn: {
        backgroundColor: '#FB902E',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
        paddingVertical: 15
    }
});