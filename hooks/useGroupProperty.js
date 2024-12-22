import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useGroupProperties = ({ groupId }) => {
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState([]);

    const fetchGroupProperties = async () => {
        setLoading(true);
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

            setProperties(response.data); 
        } catch (error) {
            console.error("Error fetching group properties:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupProperties();
    }, []);

    return { properties, loading, fetchGroupProperties };
};

export default useGroupProperties;
