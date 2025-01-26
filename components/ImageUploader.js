import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ImageUploader = ({ propertyId }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);


    const selectImages = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const maxFileSize = 5 * 1024 * 1024;
            const selectedImages = result.assets
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

            setImages([...images, ...selectedImages]);
        }
    };

    const removeImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };

    const uploadImages = async () => {
        if (images.length === 0) {
            alert('Please select images to upload.');
            return;
        }

        if (!propertyId) {
            alert('Property ID is required to upload images.');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('property', propertyId);

        images.forEach((image, index) => {
            const fileData = {
                uri: image.uri,
                type: image.type,
                name: image.name,
            };
            formData.append('image', fileData);
        });

        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                alert('User authentication token not found. Please log in.');
                setLoading(false);
                return;
            }

            const response = await axios.post(
                'https://realvistamanagement.com/portfolio/upload-portfolio-image/',
                formData,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            alert('Images uploaded successfully.');
            setImages([]);
        } catch (error) {
            if (error.response) {
                console.error('Server Error:', error.response.data);
                alert(`Upload failed: ${error.response.data.message || 'Server error'}`);
            } else if (error.request) {
                console.error('No response from server:', error.request);
                alert('No response from the server. Please check your network.');
            } else {
                console.error('Error:', error.message);
                alert(`Upload failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.button, { borderColor: '#FB902E', borderWidth: 1.5 }]} onPress={selectImages}>
                <Text style={[styles.buttonText, { color: '#FB902E' }]}>Select Images</Text>
            </TouchableOpacity>

            {images.length > 0 && (
                <FlatList
                    data={images}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.imageItem}>
                            <Text style={styles.fileName}>{item.name}</Text>
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeImage(index)}
                            >
                                <Text style={styles.removeButtonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    style={styles.imageList}
                />
            )}

            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#FB902E' }, loading && styles.disabledButton]}
                onPress={uploadImages}
                disabled={loading || images.length === 0}
            >
                <Text style={styles.buttonText}>{loading ? 'Uploading...' : 'Upload Images'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '400',
    },
    disabledButton: {
        backgroundColor: '#B0C4DE',
    },
    imageList: {
        marginVertical: 10,
    },
    imageItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        marginBottom: 8,
    },
    fileName: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    removeButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#b2acac',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    removeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ImageUploader;
