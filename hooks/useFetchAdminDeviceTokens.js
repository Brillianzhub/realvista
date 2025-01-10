import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useFetchAdminDeviceTokens = (uniqueGroupId) => {
    const [deviceTokens, setDeviceTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminDeviceTokens = async () => {

            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                return;
            }
            const url = `https://www.realvistamanagement.com/notifications/groups/${uniqueGroupId}/admin-devices/`

            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',

                    },
                });
                setDeviceTokens(response.data.device_tokens);
            } catch (err) {
                console.error("Error fetching properties:", err);
                setError(err.message || "Something went wrong!");
            } finally {
                setLoading(false);
            }
        };

        fetchAdminDeviceTokens();
    }, [uniqueGroupId]);

    return { deviceTokens, loading, error };
};

export default useFetchAdminDeviceTokens;
