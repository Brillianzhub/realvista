import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileForm = () => {
    const [profile, setProfile] = useState({
        avatar: '',
        phone_number: '',
        country_of_residence: '',
        city: '',
        street: '',
        house_number: '',
        postal_code: '',
        birth_date: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) return;

            const response = await axios.get('https://realvistamanagement.com/accounts/profile/', {
                headers: { Authorization: `Token ${token}` },
            });
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };


    const selectImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            const maxFileSize = 5 * 1024 * 1024;
            const selectedImage = result.assets
                .filter(asset => {
                    if ((asset.fileSize || 0) > maxFileSize) {
                        alert(`The image "${asset.fileName || 'selected'}" exceeds the 5MB size limit.`);
                        return false;
                    }
                    return true;
                })
                .map(asset => {
                    const uri = asset.uri;
                    const name = asset.fileName || `image_${Date.now()}.jpg`;

                    const extension = uri.split('.').pop().toLowerCase();
                    let type = 'image/jpeg';

                    if (['jpg', 'jpeg'].includes(extension)) type = 'image/jpeg';
                    else if (extension === 'png') type = 'image/png';
                    else if (extension === 'gif') type = 'image/gif';

                    return {
                        uri,
                        type,
                        name,
                    };
                });

            setProfile({ ...profile, avatar: selectedImage.assets[0].uri });
        }
    };

    const handleChange = (field, value) => {
        if (field === 'birth_date') {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(value)) {
                Alert.alert('Invalid Date', 'Please enter the date in YYYY-MM-DD format.');
                return;
            }
        }
        setProfile({ ...profile, [field]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);

        if (profile.avatar) {
            formData.append("avatar", {
                uri: profile.avatar,
                name: "profile.jpg",
                type: "image/jpeg",
            });
        }

        formData.append("phone_number", profile.phone_number);
        formData.append("country_of_residence", profile.country_of_residence);
        formData.append("city", profile.city);
        formData.append("street", profile.street);
        formData.append("house_number", profile.house_number);
        formData.append("postal_code", profile.postal_code);
        formData.append("birth_date", profile.birth_date);

        console.log(JSON.stringify(formData))
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) return;

            const response = await axios.post(
                'https://realvistamanagement.com/accounts/profile/create/',
                formData,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Profile update failed:', error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={selectImage} style={styles.imageContainer}>
                {profile.avatar ? (
                    <Image source={{ uri: profile.avatar }} style={styles.avatar} />
                ) : (
                    <Text>Select Profile Picture</Text>
                )}
            </TouchableOpacity>

            <TextInput placeholder="Phone Number" value={profile.phone_number} onChangeText={(text) => handleChange('phone_number', text)} style={styles.input} />
            <TextInput placeholder="Country" value={profile.country_of_residence} onChangeText={(text) => handleChange('country_of_residence', text)} style={styles.input} />
            <TextInput placeholder="City" value={profile.city} onChangeText={(text) => handleChange('city', text)} style={styles.input} />
            <TextInput placeholder="Street" value={profile.street} onChangeText={(text) => handleChange('street', text)} style={styles.input} />
            <TextInput placeholder="House Number" value={profile.house_number} onChangeText={(text) => handleChange('house_number', text)} style={styles.input} />
            <TextInput placeholder="Postal Code" value={profile.postal_code} onChangeText={(text) => handleChange('postal_code', text)} style={styles.input} />
            <TextInput placeholder="Birth Date (YYYY-MM-DD)" value={profile.birth_date} onChangeText={(text) => handleChange('birth_date', text)} style={styles.input} />

            <TouchableOpacity onPress={handleSubmit} style={styles.button} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update Profile'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#FB902E',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 16 },
});

export default ProfileForm;
