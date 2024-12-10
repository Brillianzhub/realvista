export function compareProperties(properties) {
    return properties.map(property => ({
        name: property.title,
        totalIncome: parseFloat(property.totalIncome),
        totalExpenses: parseFloat(property.totalExpenses),
        netReturn: parseFloat(property.netReturn),
        percentageReturn: parseFloat(property.percentageReturn),
        appreciationPercentage: parseFloat(property.appreciationPercentage),
        overallReturnPercentage: parseFloat(property.overallReturnPercentage),
        // investmentHealth: property.analysis.investmentHealth,
        // incomeHealth: property.analysis.incomeHealth,
    }));
}
