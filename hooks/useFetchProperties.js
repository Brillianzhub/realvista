import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useFetchProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProperties = useCallback(async () => {
        setLoading(true); 
        setError(null); 

        try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                throw new Error("Authentication token not found!");
            }

            const url = `https://www.realvistamanagement.com/market/fetch-listed-properties`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setProperties(response.data.results);
        } catch (err) {
            console.error("Error fetching properties:", err);
            setError(err.message || "Something went wrong!");
        } finally {
            setLoading(false); 
        }
    }, []);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    return { properties, fetchProperties, loading, error };
};

export default useFetchProperties;
