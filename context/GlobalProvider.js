import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "../lib/userService";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const res = await getCurrentUser();
            if (res) {
                setIsLogged(true);
                setUser(res);
            } else {
                setIsLogged(false);
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const reloadProfile = () => {
        fetchGroups();
    };

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
                fetchGroups,
                reloadProfile,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
