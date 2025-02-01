import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure AsyncStorage is imported
import { useGlobalContext } from '@/context/GlobalProvider';

const ProgressTracker = ({ onDataFetched }) => {
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
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                // Update local state
                setProgress(response.data.progress);

                // Send data to the parent component
                if (onDataFetched) {
                    onDataFetched({
                        progress: response.data.progress,
                        loading: false,
                        error: null,
                    });
                }
            } catch (err) {
                const errorMessage = err.response?.data?.error || 'Failed to fetch progress records.';
                setError(errorMessage);

                // Send error to the parent component
                if (onDataFetched) {
                    onDataFetched({
                        progress: [],
                        loading: false,
                        error: errorMessage,
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProgress();
        }
    }, [user, onDataFetched]);

    if (loading) {
        return <p>Loading progress records...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h2>Your Progress</h2>
            {progress.length > 0 ? (
                <ul>
                    {progress.map((record) => (
                        <li key={record.id}>
                            <strong>Module:</strong> {record.module.title} <br />
                            <strong>Score:</strong> {record.score}/{record.total} <br />
                            <strong>Status:</strong> {record.passed ? 'Passed' : 'Failed'} <br />
                            <strong>Date Completed:</strong> {new Date(record.date_completed).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No progress records found.</p>
            )}
        </div>
    );
};

export default ProgressTracker;