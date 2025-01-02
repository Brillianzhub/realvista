import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useCurrency } from '@/context/CurrencyContext';

const usePortfolioDetail = () => {
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [result, setResult] = useState(null);
    const { currency } = useCurrency();

    const fetchPortfolioDetails = async () => {
        if (!refreshing) setLoading(true);
        try {
            const token = await AsyncStorage.getItem('authToken');

            if (!token) {
                console.log('This operation requires verified user!');
                return;
            }

            const response = await axios.get(`https://www.realvistamanagement.com/portfolio/portfolio-analysis/?currency=${currency}`, {
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setPortfolioData(response.data);
        } catch (error) {
            console.error("Error fetching user properties:", error.response?.data || error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    function calculateMetrics(data) {
        if (!data) {
            throw new Error("Input data is missing.");
        }

        const categories = ["group_summary", "personal_summary", "overall_summary"];
        const results = {};

        categories.forEach((category) => {
            const summary = data[category];

            if (!summary) {
                throw new Error(`Missing data for ${category}`);
            }

            const {
                total_initial_cost,
                total_current_value,
                net_cash_flow,
                total_income,
                total_expenses
            } = summary;

            // Perform calculations
            const netAppreciation = total_current_value - total_initial_cost;
            const averageAppreciationPercentage =
                (netAppreciation / total_initial_cost) * 100;
            const roi = ((netAppreciation + net_cash_flow) / total_initial_cost) * 100;

            // Store results
            results[category] = {
                totalInitialCost: total_initial_cost,
                totalCurrentValue: total_current_value,
                netAppreciation,
                averageAppreciationPercentage: parseFloat(averageAppreciationPercentage.toFixed(2)),
                totalIncome: total_income,
                totalExpenses: total_expenses,
                netCashFlow: net_cash_flow,
                roi: parseFloat(roi.toFixed(2))
            };
        });

        return results;
    }

    useEffect(() => {
        if (portfolioData) {
            const calculatedResults = calculateMetrics(portfolioData);
            setResult(calculatedResults);
        }
    }, [portfolioData]);

    useEffect(() => {
        fetchPortfolioDetails();
    }, []);

    return { result, portfolioData, loading, setLoading, currency, fetchPortfolioDetails };
};

export default usePortfolioDetail;
