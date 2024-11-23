import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '@/context/GlobalProvider';
import axios from 'axios';

const useUserOrders = () => {
    const { user } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);


    useEffect(() => {
        const fetchUserOrders = async () => {
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

                const response = await axios.get(`https://brillianzhub.eu.pythonanywhere.com/order/user-orders/by_user_email/?user_email=${user_email}`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setOrders(response.data);
            } catch (error) {
                console.error("Encountered error while loading the data", error);
            }
        }

        if (user?.email) {
            fetchUserOrders();
        }

    }, [user]);

    return { orders, loading };
};

export default useUserOrders;
