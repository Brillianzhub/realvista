import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useFetchMembersDeviceTokens = (uniqueGroupId) => {
    const [membersTokens, setMembersTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMemberDeviceTokens = async () => {

            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                return;
            }
            const url = `https://www.realvistamanagement.com/notifications/groups/${uniqueGroupId}/devices/`

            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',

                    },
                });
                setMembersTokens(response.data.device_tokens);
            } catch (err) {
                console.error("Error fetching properties:", err);
                setError(err.message || "Something went wrong!");
            } finally {
                setLoading(false);
            }
        };

        fetchMemberDeviceTokens();
    }, [uniqueGroupId]);

    return { membersTokens, loading, error };
};

export default useFetchMembersDeviceTokens;
