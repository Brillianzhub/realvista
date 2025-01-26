import React, { useState } from 'react';
import { View, Button, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CustomImagePicker = ({ onImagesSelected }) => {
    const [images, setImages] = useState([]);

    const selectImages = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library is required!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const maxFileSize = 5 * 1024 * 1024; // 5MB limit

            // Validate image size
            const selectedImages = result.assets
                .filter(asset => {
                    if (asset.fileSize && asset.fileSize > maxFileSize) {
                        alert(`The image "${asset.fileName || 'selected'}" exceeds the 5MB size limit.`);
                        return false; // Exclude large files
                    }
                    return true;
                })
                .map(asset => ({
                    uri: asset.uri,
                    type: asset.type || 'image/jpeg',
                    name: asset.fileName || `image_${Date.now()}.jpg`,
                }));

            // Update state and notify parent
            const updatedImages = [...images, ...selectedImages];
            setImages(updatedImages);
            onImagesSelected(updatedImages);
        }
    };

    const removeImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        onImagesSelected(updatedImages);
    };

    return (
        <View style={styles.container}>
            <Button title="Select Images" onPress={selectImages} />
            {images.length > 0 && (
                <FlatList
                    data={images}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{item.name}</Text>
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeImage(index)}
                            >
                                <Text style={styles.removeButtonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 4,
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
    },
    text: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    removeButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#bcb5b5',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default CustomImagePicker;
