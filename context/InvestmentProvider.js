import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '../context/GlobalProvider';



const InvestmentContext = createContext();

export const InvestmentProvider = ({ children }) => {
    const { user } = useGlobalContext();
    const [investment, setInvestment] = useState([]);
    const [orders, setOrders] = useState([]);


    return (
        <InvestmentContext.Provider
            value={{ investment, setInvestment }}
        >
            {children}
        </InvestmentContext.Provider>
    );
};



export const useInvestmentData = () => {
    const context = useContext(InvestmentContext);

    if (!context) {
        throw new Error('useInvestmentData must be used within an InvestmentProvider');
    }
    return context;
};