import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFetchVendorProperties = (email) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProperties = useCallback(async () => {
        if (!email) return;

        setLoading(true);
        setError(null);

        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await axios.get(
                `https://www.realvistamanagement.com/market/fetch-properties-by-email/?email=${email}`,
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );

            setProperties(response.data);  // This now contains only the latest 10 listings
        } catch (err) {
            setError(err.response ? err.response.data : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [email]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    return { properties, loading, setLoading, error, refetch: fetchProperties };
};

export default useFetchVendorProperties;
