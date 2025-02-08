import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import InvestmentInsight from "../../components/Portfolio/InvestmentInsight";
import { formatCurrency } from '@/utils/formatCurrency';

const Financials = ({ property, colors }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Financial Overview</Text>
                <View style={styles.item}>
                    <FontAwesome5 name="chart-line" size={16} color={colors.primary} style={styles.icon} />
                    <Text style={styles.label}>Current Market Value:</Text>
                    <Text style={styles.value}>{formatCurrency(property.current_value, property.currency)}</Text>
                </View>

                <View style={styles.item}>
                    <FontAwesome5 name="money-bill-wave" size={16} color={colors.secondary} style={styles.icon} />
                    <Text style={styles.label}>Initial Purchase Price:</Text>
                    <Text style={styles.value}>{formatCurrency(property.initial_cost, property.currency)}</Text>
                </View>
            </View>
            <View style={styles.content}>
                <View style={styles.item}>
                    <FontAwesome5 name="chart-bar" size={16} color={colors.tertiary} style={styles.icon} />
                    <Text style={styles.label}>Appreciation Value:</Text>
                    <View style={styles.row}>
                        <Text style={styles.value}>{formatCurrency(property.appreciation, property.currency)}</Text>
                    </View>
                </View>

                <View style={styles.item}>
                    <FontAwesome5 name="percentage" size={16} color={colors.accent} style={styles.icon} />
                    <Text style={styles.label}>Return on Investment (ROI):</Text>
                    <Text style={styles.value}>{property.percentageReturn}%</Text>
                </View>
            </View>
            <View style={styles.content}>
                <InvestmentInsight property={property} colors={colors} />
            </View>
        </View>
    );
};

export default Financials;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: 10,
        marginVertical: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "left",
        color: "#333",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
        padding: 10,
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
    },
    icon: {
        marginRight: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        flex: 1,
        color: "#555",
    },
    value: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    insight: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        backgroundColor: "#f0f8ff",
        padding: 12,
        borderRadius: 8,
    },
    insightText: {
        marginLeft: 8,
        fontSize: 14,
        color: "#555",
    },
});
