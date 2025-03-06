import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { TouchableOpacity } from 'react-native';

const CreateEnterpriseScreen = ({ route, navigation }) => {
    const { groupId, name, description } = route.params || {};

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            title: groupId ? 'Update Group' : 'Create New Group',
        });
    }, [groupId, navigation]);

    const initialValues = {
        name: name || '',
        description: description || '',
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Group name is required.'),
        description: Yup.string(),
    });

    const handleSubmitGroup = async (values, { setSubmitting, resetForm }) => {
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) throw new Error('Authentication token is missing.');

            let response;
            if (groupId) {
                response = await axios.put(
                    `https://www.realvistamanagement.com/enterprise/update-group/${groupId}/`,
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
            } else {
                response = await axios.post(
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
            }

            if (response.status === 200 || response.status === 201) {
                Alert.alert(
                    'Success',
                    groupId ? 'Group updated successfully!' : 'Group created successfully!'
                );
                resetForm();
                navigation.navigate('EnterpriseHomeScreen');
            } else {
                Alert.alert('Error', response.data?.error || 'Operation failed.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'An error occurred.';
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
            onSubmit={handleSubmitGroup}
            enableReinitialize={true}
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
                            <Text style={styles.btnText}>{groupId ? 'Updating...' : 'Creating...'}</Text>
                        ) : (
                            <Text style={styles.btnText}>{groupId ? 'Update Group' : 'Create Group'}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </Formik>
    );
};

export default CreateEnterpriseScreen;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
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
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    btnText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 18,
    },
});
