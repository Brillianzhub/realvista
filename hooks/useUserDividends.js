import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useGlobalContext } from '@/context/GlobalProvider';

const useUserDividends = () => {
    const { user } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const [dividends, setDividends] = useState([]);
    const [totalDividends, setTotalDividends] = useState(0);

    useEffect(() => {
        const fetchDividends = async () => {
            setLoading(true);
            try {
                const userEmail = user?.email;

                if (!userEmail) {
                    Alert.alert('Error', 'User email is required.');
                    setLoading(false);
                    return;
                }

                const token = await AsyncStorage.getItem('authToken');

                if (!token) {
                    Alert.alert('Error', 'Authentication token not found!');
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `https://brillianzhub.eu.pythonanywhere.com/dividends/user-dividends/?email=${userEmail}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Token ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setDividends(data.dividends || []);
                    setTotalDividends(data.total_user_share || 0);
                    // setTotalRetention(data.total_retention || 0);
                } else {
                    const errorMessage = data?.message || data?.error || data?.detail || `Error ${response.status}: Failed to fetch dividends.`;
                    Alert.alert('Error', errorMessage);
                }
            } catch (error) {
                console.error('Error fetching dividends:', error);
                Alert.alert('Error', 'An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchDividends();
        }

    }, [user]);

    return { dividends, totalDividends, loading };
};

export default useUserDividends;
