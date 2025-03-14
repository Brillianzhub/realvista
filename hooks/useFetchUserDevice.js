import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useFetchUserDevice = (email) => {
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [debouncedEmail, setDebouncedEmail] = useState(email);

    // Debounce logic (waits 500ms before setting the email)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedEmail(email);
        }, 500);

        return () => clearTimeout(handler);
    }, [email]);

    useEffect(() => {
        const fetchUserDevice = async () => {
            if (!debouncedEmail || !debouncedEmail.includes("@")) {
                setDevice(null);
                setError(null);
                return;
            }

            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                setError("No authentication token found.");
                return;
            }

            const url = `https://realvistamanagement.com/notifications/get_user_device/?email=${encodeURIComponent(debouncedEmail)}`;

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setDevice(response.data);
            } catch (err) {
                console.error("Error fetching user device:", err);
                setDevice(null);
                setError(err.response?.data?.message || "Device not found.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDevice();
    }, [debouncedEmail]);

    return { device, loading, error };
};

export default useFetchUserDevice;
