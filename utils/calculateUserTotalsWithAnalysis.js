export function calculateUserTotalsWithAnalysis(properties) {
    const totals = properties.reduce(
        (acc, property) => {
            acc.totalInvestment += parseFloat(property.initial_cost || 0);
            acc.totalCurrentValue += parseFloat(property.current_value || 0);
            acc.totalExpenses += property.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
            acc.totalIncome += property.incomes.reduce((sum, income) => sum + parseFloat(income.amount || 0), 0);
            return acc;
        },
        { totalInvestment: 0, totalCurrentValue: 0, totalExpenses: 0, totalIncome: 0 }
    );

    // Calculate derived metrics
    const totalProfit =
        (totals.totalCurrentValue + totals.totalIncome) -
        (totals.totalInvestment + totals.totalExpenses); 
    const percentageReturn = totals.totalInvestment
        ? (totalProfit / totals.totalInvestment) * 100
        : 0; // Percentage return based on total profit and investment

    const netIncome = totals.totalIncome - totals.totalExpenses; 

    return {
        totalInvestment: totals.totalInvestment.toFixed(2),
        totalCurrentValue: totals.totalCurrentValue.toFixed(2),
        totalExpenses: totals.totalExpenses.toFixed(2),
        totalIncome: totals.totalIncome.toFixed(2),
        totalProfit: totalProfit.toFixed(2),
        percentageReturn: percentageReturn.toFixed(2) + "%",
        netIncome: netIncome.toFixed(2),
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
                netIncome >= 0
                    ? "Positive cash flow"
                    : "Negative cash flow - reduce expenses or increase income",
        },
    };
}
