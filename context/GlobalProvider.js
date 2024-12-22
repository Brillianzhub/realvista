import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "../lib/userService";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user and groups function
    const fetchGroups = async () => {
        setLoading(true); // Optional: show loading state
        try {
            const res = await getCurrentUser();
            if (res) {
                setIsLogged(true);
                setUser(res); // Update user and groups
            } else {
                setIsLogged(false);
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setLoading(false); // End loading state
        }
    };

    // Initial fetch on mount
    useEffect(() => {
        fetchGroups();
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                setIsLogged,
                user,
                setUser,
                loading,
                fetchGroups, // Provide fetchGroups in context
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
