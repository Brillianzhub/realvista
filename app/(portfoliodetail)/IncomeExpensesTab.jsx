import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { formatCurrency } from '@/utils/formatCurrency';
import InvestmentInsight from "../../components/Portfolio/InvestmentInsight";



const IncomeExpensesTab = ({ data, property, colors }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Income & Expenses</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Incomes</Text>
                {data.incomes.map((income, index) => (
                    <View key={index} style={styles.item}>
                        <FontAwesome5 name="money-bill-wave" size={16} color="green" style={styles.icon} />
                        <View style={styles.textContainer}>
                            <Text style={styles.description}>{income.description}</Text>
                            <Text style={styles.date}>{income.date_received}</Text>
                        </View>
                        <Text style={styles.amount}>{formatCurrency(income.amount, income.currency)}</Text>
                    </View>
                ))}
                <Text style={styles.total}>Total Income: {formatCurrency(data.totalIncome, property.currency)}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Expenses</Text>
                {data.expenses.map((expense, index) => (
                    <View key={index} style={styles.item}>
                        <FontAwesome5 name="wallet" size={16} color="red" style={styles.icon} />
                        <View style={styles.textContainer}>
                            <Text style={styles.description}>{expense.description}</Text>
                            <Text style={styles.date}>{expense.date_incurred}</Text>
                        </View>
                        <Text style={styles.amount}>{formatCurrency(expense.amount, expense.currency)}</Text>
                    </View>
                ))}
                <Text style={styles.total}>Total Expenses: {formatCurrency(data.totalExpenses, property.currency)}</Text>
            </View>
            <View style={[styles.section, { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }]}>
                <Text style={styles.sectionTitle}>Net Return</Text>
                <Text style={styles.total}>{formatCurrency(data.netReturn, property.currency)}</Text>
            </View>

            {/* <InvestmentInsight property={property} colors={colors} /> */}
        </View>
    );
};

export default IncomeExpensesTab;

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        padding: 10
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
        textAlign: "left",
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingBottom: 5,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: "#ddd",
    },
    icon: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    description: {
        fontSize: 14,
        fontWeight: "bold",
    },
    date: {
        fontSize: 12,
        color: "#666",
    },
    amount: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    total: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "right",
    },
});
