import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useFetchProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {

            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                return;
            }
            const url = `https://www.realvistamanagement.com/market/fetch-listed-properties`

            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',

                    },
                });
                setProperties(response.data);
            } catch (err) {
                console.error("Error fetching properties:", err);
                setError(err.message || "Something went wrong!");
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    return { properties, loading, error };
};

export default useFetchProperties;
