export function calculateReturns(properties) {
    return properties.map(property => {
        const totalIncome = (property.incomes || []).reduce((acc, income) => acc + parseFloat(income.amount || 0), 0);
        const totalExpenses = (property.expenses || []).reduce((acc, expense) => acc + parseFloat(expense.amount || 0), 0);

        const initialCost = parseFloat(property.initial_cost) || 0;
        const currentValue = parseFloat(property.current_value) || 0;

        const netReturn = totalIncome - totalExpenses;

        const incomeReturnPercentage = initialCost > 0
            ? (netReturn / initialCost) * 100
            : 0;

        const appreciationPercentage = initialCost > 0
            ? ((currentValue - initialCost) / initialCost) * 100
            : 0;

        const overallReturnPercentage = initialCost > 0
            ? appreciationPercentage + ((netReturn / initialCost) * 100)
            : 0;

        const percentageReturn = initialCost > 0
            ? ((currentValue - initialCost + netReturn) / (initialCost + totalExpenses)) * 100
            : 0;

        return {
            ...property,
            totalIncome: totalIncome.toFixed(2),
            totalExpenses: totalExpenses.toFixed(2),
            percentageReturn: percentageReturn.toFixed(2),
            incomeReturnPercentage: incomeReturnPercentage.toFixed(2),
            appreciationPercentage: appreciationPercentage.toFixed(2),
            overallReturnPercentage: overallReturnPercentage.toFixed(2),
            netReturn: netReturn.toFixed(2),
            analysis: {
                investmentHealth:
                    percentageReturn >= 50
                        ? "Excellent returns"
                        : percentageReturn >= 20
                            ? "Good returns"
                            : percentageReturn > 0
                                ? "Moderate returns"
                                : "Negative returns - review investments",
                incomeHealth:
                    netReturn >= 0
                        ? "Positive cash flow"
                        : "Negative cash flow - reduce expenses or increase income",
            },
        };
    });
}
