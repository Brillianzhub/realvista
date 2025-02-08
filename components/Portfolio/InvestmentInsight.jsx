import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@/context/ThemeContext";

const InvestmentInsight = ({ property }) => {
    const { colors } = useTheme();

    let insightMessage = "No significant changes in the property's value.";
    let icon = "bulb-outline";
    let iconColor = colors.tint;
    let bgColor = "#f0f8ff";

    const appreciation = parseFloat(property.appreciation);
    const appreciationPercentage = parseFloat(property.appreciationPercentage);
    const netReturn = parseFloat(property.netReturn);
    const incomeHealth = property.analysis?.incomeHealth;
    const investmentHealth = property.analysis?.investmentHealth;

    if (appreciationPercentage > 0) {
        insightMessage = `The property has appreciated by ${appreciationPercentage}%, indicating strong investment growth.`;
        icon = "trending-up";
        iconColor = "green";
        bgColor = "#e6f4ea";
    } else if (appreciationPercentage < 0) {
        insightMessage = `The property value has decreased by ${Math.abs(appreciationPercentage)}%. Consider reassessing your investment strategy.`;
        icon = "trending-down";
        iconColor = "red";
        bgColor = "#fdecea";
    } else if (netReturn > 0) {
        insightMessage = `The property is generating a net return of ₦${netReturn}, contributing positively to your portfolio.`;
        icon = "cash-outline";
        iconColor = "green";
        bgColor = "#e6f4ea";
    } else if (netReturn < 0) {
        insightMessage = `The property is experiencing a net loss of ₦${Math.abs(netReturn)}. Consider optimizing expenses or increasing revenue sources.`;
        icon = "warning-outline";
        iconColor = "red";
        bgColor = "#fdecea";
    } else if (incomeHealth === "Positive cash flow") {
        insightMessage = "This property has positive cash flow, ensuring stable income generation.";
        icon = "trending-up";
        iconColor = "green";
        bgColor = "#e6f4ea";
    } else if (investmentHealth === "Poor performance") {
        insightMessage = "This property has poor investment performance. Consider reviewing its potential.";
        icon = "alert-circle-outline";
        iconColor = "red";
        bgColor = "#fdecea";
    }

    return (
        <View style={[styles.insight, { backgroundColor: bgColor }]}>
            <Ionicons name={icon} size={20} color={iconColor} />
            <Text style={[styles.insightText, { color: iconColor }]}>
                {insightMessage}
            </Text>
        </View>
    );
};

export default InvestmentInsight;

const styles = StyleSheet.create({
    insight: {
        flexDirection: "row",
        alignItems: "flex-start", 
        padding: 10,
        borderRadius: 6,
        marginTop: 10,
        flexWrap: "wrap", 
    },
    insightText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: "500",
        flex: 1, 
    },
});