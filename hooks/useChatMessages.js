import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useChatMessages = ({ uniqueGroupId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                setMessages([]);
                return;
            }

            const response = await fetch(`https://www.realvistamanagement.com/chats/retrieve-messages/?uniqueGroupID=${uniqueGroupId}`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                setMessages([]);
                return;
            }

            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [uniqueGroupId]);


    return { messages, setMessages, fetchMessages, loading, error };
};

export default useChatMessages;
