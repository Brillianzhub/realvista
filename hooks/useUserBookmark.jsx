import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";


const useUserBookmark = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookmarks = async () => {
        try {

            setLoading(true);
            setError(null);

            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token is missing!')
            }

            const response = await axios.get(`https://www.realvistamanagement.com/market/user-bookmarks`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            setBookmarks(response.data)
        } catch (error) {
            setError(error.response?.data?.detail || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);


    return { bookmarks, loading, setLoading, fetchBookmarks };

}

export default useUserBookmark;