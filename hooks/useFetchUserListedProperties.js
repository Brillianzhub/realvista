import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFetchUserListedProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found');
            }
            const response = await axios.get(
                'https://www.realvistamanagement.com/market/fetch-user-listed-properties/',
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setProperties(response.data);
        } catch (err) {
            setError(err.response ? err.response.data : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    return { properties, loading, setLoading, error, refetch: fetchProperties };
};

export default useFetchUserListedProperties;
