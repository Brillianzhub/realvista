import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import ImagePickerComponent from '@/components/CustomImagePicker';
import { uploadImages } from '../../components/ImageUploader';

const ParentComponent = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const propertyId = 1;

    const handleUpload = () => {
        uploadImages(images, propertyId, setLoading, setError)
            .then(() => setImages([])) 
            .catch((err) => console.error(err));
    };

    return (
        <View style={styles.container}>
            <ImagePickerComponent onImagesSelected={setImages} />
            <Button
                title={loading ? 'Uploading...' : 'Upload Images'}
                onPress={handleUpload}
                disabled={loading || images.length === 0}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        color: 'red',
        marginTop: 16,
    },
});

export default ParentComponent;
