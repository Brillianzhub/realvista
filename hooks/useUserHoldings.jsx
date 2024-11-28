import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '@/context/GlobalProvider';
import axios from 'axios';

const useUserHoldings = () => {
    const { user } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const [holdings, setHoldings] = useState([]);

    const fetchUserHoldings = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                console.log("Token required for this operation");
                return;
            }

            const user_email = user?.email;
            if (!user_email) {
                console.log("User email is not available");
                return;
            }

            const response = await axios.get(`https://brillianzhub.eu.pythonanywhere.com/holdings/user-holdings/by_user_email/?user_email=${user_email}`, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setHoldings(response.data);
        } catch (error) {
            console.error("Encountered error while loading the data", error);
        }
    }

    useEffect(() => {
        if (user?.email) {
            fetchUserHoldings();
        }

    }, [user]);

    return { holdings, loading, fetchUserHoldings };
};

export default useUserHoldings;
