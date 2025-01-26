import axios from 'axios';

const uploadImageUrls = async (token, propertyId, imageUrls) => {
    try {
        const payload = {
            property: propertyId,
            image_url: imageUrls,
        };

        const response = await axios.post(
            `https://www.realvistamanagement.com/market/upload-image/`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
            }
        );

    } catch (error) {
        console.error('Error uploading image URLs:', error.response?.data || error.message);
        throw error;
    }
};

export default uploadImageUrls;
