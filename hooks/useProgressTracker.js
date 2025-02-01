import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '@/context/GlobalProvider';

const useProgressTracker = () => {
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useGlobalContext();

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (!token) return;

                const response = await axios.get('https://realvistamanagement.com/courses/fetch-progress/', {
                    headers: { Authorization: `Token ${token}` },
                });

                setProgress(response.data.progress);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch progress records.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProgress();
        }
    }, [user]);

    return { progress, loading, error };
};

export default useProgressTracker;
