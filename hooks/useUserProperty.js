import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useUserProperties = () => {
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState([]);

    const fetchUserProperties = async () => {
        setLoading(true); // Start loading indicator
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                console.error("Token is required for this operation");
                return;
            }

            const response = await axios.get(`https://www.realvistamanagement.com/portfolio/properties/`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setProperties(response.data); // Update state with fetched properties
        } catch (error) {
            console.error("Error fetching user properties:", error.response?.data || error.message);
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    useEffect(() => {
        fetchUserProperties();
    }, []);

    return { properties, setLoading, loading, fetchUserProperties };
};

export default useUserProperties;
