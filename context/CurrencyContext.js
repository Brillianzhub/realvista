import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('NGN');

    useEffect(() => {
        const loadCurrency = async () => {
            try {
                const storedCurrency = await AsyncStorage.getItem('defaultCurrency');
                if (storedCurrency) {
                    setCurrency(storedCurrency);
                }
            } catch (error) {
                console.error('Failed to load currency from storage:', error);
            }
        };
        loadCurrency();
    }, []);

    const updateCurrency = async (newCurrency) => {
        try {
            setCurrency(newCurrency);
            await AsyncStorage.setItem('defaultCurrency', newCurrency);
        } catch (error) {
            console.error('Failed to save currency to storage:', error);
        }
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
