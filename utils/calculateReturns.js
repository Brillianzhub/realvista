export function calculateReturns(properties) {
    return properties.map(property => {
        // Default to empty arrays if incomes/expenses are missing
        const totalIncome = (property.incomes || []).reduce((acc, income) => acc + parseFloat(income.amount || 0), 0);
        const totalExpenses = (property.expenses || []).reduce((acc, expense) => acc + parseFloat(expense.amount || 0), 0);

        // Parse initial cost and current value
        const initialCost = parseFloat(property.initial_cost) || 0;
        const currentValue = parseFloat(property.current_value) || 0;

        // Calculate net return (income - expenses)
        const netReturn = totalIncome - totalExpenses;

        // Calculate percentage return based on initial cost and current value
        const percentageReturn = initialCost > 0
            ? ((currentValue - initialCost + netReturn) / initialCost) * 100
            : 0; // Avoid division by zero

        // Return the property with calculated totals and percentage return
        return {
            ...property,
            totalIncome: totalIncome.toFixed(2),
            totalExpenses: totalExpenses.toFixed(2),
            percentageReturn: percentageReturn.toFixed(2),
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
