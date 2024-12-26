import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useGroupProperties = ({ uniqueGroupId }) => {
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

            if (!uniqueGroupId) {
                console.error("Group ID is required to fetch properties.");
                return;
            }

            const response = await axios.get(
                `https://www.realvistamanagement.com/enterprise/groups/${uniqueGroupId}/properties/`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setProperties(response.data);
        } catch (error) {
            console.error("Error fetching group properties:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (uniqueGroupId) {
            fetchGroupProperties();
        }
    }, [uniqueGroupId]);

    return { properties, loading, setLoading, fetchGroupProperties };
};

export default useGroupProperties;
