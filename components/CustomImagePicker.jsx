import React, { useState } from 'react';
import { View, Button, FlatList, Image, StyleSheet } from 'react-native';
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
            const selectedImages = result.assets.map((asset) => ({
                uri: asset.uri,
                type: asset.type || 'image/jpeg',
                name: asset.fileName || `image_${Date.now()}.jpg`,
            }));

            setImages([...images, ...selectedImages]);
            onImagesSelected([...images, ...selectedImages]); 
        }
    };

    return (
        <View>
            <Button title="Select Images" onPress={selectImages} />
            {images.length > 0 && (
                <FlatList
                    data={images}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.uri }} style={styles.imagePreview} />
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        margin: 8,
    },
    imagePreview: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 8,
    },
});

export default CustomImagePicker;
