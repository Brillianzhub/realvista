const groupData = (property) => {
    return {
        overview: {
            title: property.title,
            description: property.description,
            location: property.location,
            address: property.address,
            propertyType: property.property_type,
            area: property.area,
            yearBought: property.year_bought,
            status: property.status,
            coordinates: property.coordinates,
            images: property.images,
        },
        financials: {
            currentValue: property.current_value,
            initialCost: property.initial_cost,
            appreciation: property.appreciation,
            appreciationPercentage: property.appreciationPercentage,
            roi: property.roi,
            percentageReturn: property.percentageReturn,
            overallReturnPercentage: property.overallReturnPercentage,
            incomeReturnPercentage: property.incomeReturnPercentage,
            currency: property.currency,
        },
        incomeExpenses: {
            totalIncome: property.totalIncome,
            totalExpenses: property.totalExpenses,
            incomes: property.incomes,
            expenses: property.expenses,
            netReturn: property.netReturn,
        },
        analysis: {
            incomeHealth: property.analysis.incomeHealth,
            investmentHealth: property.analysis.investmentHealth,
        },
        details: {
            numUnits: property.num_units,
            zipCode: property.zip_code,
            location: property.location,
            city: property.city,
            year_bought: property.year_bought,
            user_slots: property.user_slots,
            groupOwnerName: property.group_owner_name,
        },
        files: {
            images: property.image_files,
            documents: property.documents,
            videos: property.videos
        }
    };
};


export default groupData;