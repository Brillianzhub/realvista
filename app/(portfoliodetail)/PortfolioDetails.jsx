import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from "@/context/ThemeContext";
import { router, useLocalSearchParams } from 'expo-router';
import { formatCurrency } from '@/utils/formatCurrency';
import { Ionicons } from '@expo/vector-icons';
import MapViewer from '../../components/MapViewer';

import Details from './Details';
import IncomeExpensesTab from './IncomeExpensesTab';
import groupData from './groupData';
import Financials from './Financials';
import FileRenderer from './FileRenderer';

const PortfolioDetails = () => {
    const { colors } = useTheme();
    const { selectedItem } = useLocalSearchParams();
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    if (!selectedItem) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>No data selected.</Text>
            </View>
        );
    }

    let property;
    try {
        property = JSON.parse(selectedItem);
    } catch (error) {
        console.error("Error parsing selectedItem:", error);
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Invalid data format.</Text>
            </View>
        );
    }

    const groupedData = groupData(property)

    const isPositive = property.percentage_performance > 0;
    const percentageColor = isPositive ? "#008000" : "#FF0000";
    const percentageIcon = isPositive ? "arrow-up-outline" : "arrow-down-outline";

    return (
        <ScrollView
            style={[styles.container,
            { backgroundColor: colors.background, paddingBottom: 50 }]}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.titleContent}>
                <Text style={styles.titleText}>{property.title}</Text>
                <Text style={styles.currencyText}>
                    {formatCurrency(property.current_value, property.currency)}
                </Text>

                <View style={[styles.percentageContainer, { color: percentageColor }]}>
                    <Text style={[styles.percentageText, { color: percentageColor }]}>
                        {property.percentage_performance.toFixed(2)}%
                    </Text>
                    <Ionicons name={percentageIcon} size={16} color={percentageColor} />
                </View>
            </View>

            <Financials property={property} colors={colors} />
            <IncomeExpensesTab data={groupedData.incomeExpenses} property={property} />

            <View style={styles.aboutSection}>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionHeader}>Property Info</Text>
                    <TouchableOpacity onPress={toggleExpanded}>
                        <Text
                            style={styles.dividendDescription}
                            numberOfLines={expanded ? 0 : 2}
                        >
                            {property.description}
                        </Text>
                        <Text style={[styles.toggleText, { marginTop: 5, color: '#FB902E' }]}>
                            {expanded ? 'Show Less' : 'Read More'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Details data={groupedData.details} property={property} />
            </View>
            <FileRenderer files={groupedData.files} />

            <View style={{ marginVertical: 20 }}>
                <Text style={styles.descriptionHeader}>Map Location</Text>
                <MapViewer
                    latitude={property.coordinates[0]?.latitude}
                    longitude={property.coordinates[0]?.longitude}
                    title={property.title}
                />
            </View>

            {/* Add adverts here */}
        </ScrollView>
    );
}

export default PortfolioDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    content: {
        marginBottom: 16,
    },
    titleContent: {
        paddingVertical: 20,
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        borderRadius: 25
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
    },
    titleText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#gray",
    },
    descriptionContainer: {
        marginTop: 20,
    },
    aboutSection: {
        marginBottom: 20,
        backgroundColor: '#d1d1d1',
        borderRadius: 10,
        padding: 10
    },
    descriptionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    valueContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 10,
    },
    currencyText: {
        fontWeight: "bold",
        fontSize: 24,
    },
    percentageContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    percentageText: {
        fontSize: 16,
        fontWeight: "600",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 18,
        color: "red",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#555",
    },
    value: {
        fontSize: 16,
        color: "#222",
    },
    excellent: { color: 'green' },
    good: { color: 'blue' },
    moderate: { color: 'orange' },
    poor: { color: 'red' },
    positiveCashFlow: { color: 'green' },
    negativeCashFlow: { color: 'red' },


});
