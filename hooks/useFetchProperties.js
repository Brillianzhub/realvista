import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useFetchProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        description: '',
        city: '',
        state: '',
        minPrice: null,
        maxPrice: null,
        generalSearch: '',
    });

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
                params: {
                    description: filters.description,
                    city: filters.city,
                    state: filters.state,
                    min_price: filters.minPrice,
                    max_price: filters.maxPrice,
                    general_search: filters.generalSearch
                },
            });

            setProperties(response.data.results);
        } catch (err) {
            console.error("Error fetching properties:", err);
            setError(err.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const applyFilters = useCallback((newFilters) => {
        setFilters(newFilters);
        // console.log("Applied Filters:", newFilters)
    }, []);

    return { properties, fetchProperties, loading, error, applyFilters };
};

export default useFetchProperties;