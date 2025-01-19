import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const uploadImages = async (images, propertyId, setLoading, setError) => {
    if (!propertyId) {
        setError('Property ID is required to upload images.');
        return;
    }

    if (images.length === 0) {
        setError('Please select images to upload.');
        return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();

    console.log(formData)
    formData.append('property', propertyId);

    images.forEach((image, index) => {
        formData.append('image', {
            uri: image.uri,
            type: image.type,
            name: image.name || `image_${index}.jpg`,
        });
    });

    try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            setError('User authentication token not found. Please log in.');
            setLoading(false);
            return;
        }

        const response = await axios.post(
            'https://www.realvistamanagement.com/market/upload-image/',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Token ${token}`,
                },
            }
        );

        console.log('Upload success:', response.data);
        alert('Images uploaded successfully!');
        return response.data;
    } catch (err) {
        console.error('Upload failed:', err);
        if (err.response) {
            console.error('Response error:', err.response.data);
        }
        setError('Upload failed. Please try again.');
    } finally {
        setLoading(false);
    }
};
