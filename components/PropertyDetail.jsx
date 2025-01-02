import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PagerView from 'react-native-pager-view';
import MapViewer from '../components/MapViewer';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';
import images from '@/constants/images';


const PropertyDetail = ({
    selectedItem,
    closeBottomSheet,
}) => {
    if (!selectedItem) {
        return <View><Text>No data selected.</Text></View>;
    }
    const [expanded, setExpanded] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const { currency } = useCurrency();

    const formattedInitialCost = formatCurrency(selectedItem.initial_cost, selectedItem.currency);
    const formattedCurrentCost = formatCurrency(selectedItem.current_value, selectedItem.currency);
    const formattedTotalExpenses = formatCurrency(selectedItem.totalExpenses, selectedItem.currency);
    const formattedTotalIncome = formatCurrency(selectedItem.totalIncome, selectedItem.currency);
    const formattedNetReturn = formatCurrency(selectedItem.netReturn, selectedItem.currency);

    const items = [
        {
            label: 'Investment Health',
            value: `${selectedItem.analysis.investmentHealth}`,
            style: selectedItem.analysis.investmentHealth === "Excellent returns"
                ? styles.excellent
                : selectedItem.analysis.investmentHealth === "Good returns"
                    ? styles.good
                    : selectedItem.analysis.investmentHealth === "Moderate returns"
                        ? styles.moderate
                        : styles.poor
        },
        {
            label: 'Income Health',
            value: `${selectedItem.analysis.incomeHealth}`,
            style: selectedItem.analysis.incomeHealth === "Positive cash flow"
                ? styles.positiveCashFlow
                : styles.negativeCashFlow
        },
        { label: 'Year Bought', value: `${selectedItem.year_bought}` },
        { label: 'Number of Units', value: `${selectedItem.num_units}` },
        { label: 'Property Type', value: `${selectedItem.property_type}` },
    ];

    return (
        <ScrollView
            nestedScrollEnabled={true}
            contentContainerStyle={{ flex: 1 }}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Property Details</Text>
                <TouchableOpacity onPress={closeBottomSheet}>
                    <Ionicons name="close" size={24} color="#358B8B" style={styles.closeIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.bottomSheetContent}>
                {selectedItem && (
                    <>
                        <View style={styles.overview}>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Image
                                        source={images.house}
                                        resizeMode='cover'
                                        height={48}
                                        width={48}
                                    />
                                    <View>
                                        <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                                        <Text style={[styles.modalLocation, { color: '#FB902E' }]}>{selectedItem.location}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                    <Text style={styles.portfolioSummary}>Initial Cost</Text>
                                    <Text style={[styles.portfolioSummary, { fontWeight: '600' }]}>{formattedInitialCost}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <Text style={styles.portfolioSummary}>Current Value:</Text>
                                    <Text style={[styles.portfolioSummary, { fontWeight: '600' }]}>{formattedCurrentCost}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <Text style={styles.portfolioSummary}>Appreciation Percentage</Text>
                                    <Text style={[styles.portfolioSummary, { fontWeight: '600' }]}>{selectedItem.appreciationPercentage}%</Text>
                                </View>
                            </View>
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                    <Text style={styles.portfolioSummary}>Total Income</Text>
                                    <Text style={[styles.portfolioSummary, { fontWeight: '600' }]}>{formattedTotalIncome}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <Text style={styles.portfolioSummary}>Total expenses</Text>
                                    <Text style={[styles.portfolioSummary, { fontWeight: '600' }]}>{formattedTotalExpenses}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <Text style={styles.portfolioSummary}>Net Income</Text>
                                    <Text
                                        style={[
                                            styles.portfolioSummary,
                                            { fontWeight: '600', color: selectedItem.netReturn < 0 ? 'red' : 'black' },
                                        ]}
                                    >
                                        {formattedNetReturn}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <Text style={styles.portfolioSummary}>Income Return Percentage</Text>
                                    <Text style={[styles.portfolioSummary, { fontWeight: '600' }]}>{selectedItem.incomeReturnPercentage}%</Text>
                                </View>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <Text style={styles.portfolioSummary}>Overall Return Percentage</Text>
                                    <Text style={[styles.portfolioSummary, { fontWeight: '600' }]}>{selectedItem.percentageReturn}%</Text>
                                </View>
                            </View>
                        </View>

                        <PagerView
                            style={styles.pagerView}
                            initialPage={0}
                            onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
                        >
                            {items.map((item, index) => (
                                <View key={index} style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>{item.label}</Text>
                                    <Text style={[styles.detailValue, item.style]}>{item.value}</Text>
                                </View>
                            ))}
                        </PagerView>
                        <View style={styles.dotsContainer}>
                            {items.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        currentPage === index ? styles.activeDot : styles.inactiveDot,
                                    ]}
                                />
                            ))}
                        </View>
                        <View style={styles.dividendsContainer}>
                            <Text style={styles.dividendsHeader}>Property info</Text>
                            <TouchableOpacity onPress={toggleExpanded}>
                                <Text
                                    style={styles.dividendDescription}
                                    numberOfLines={expanded ? 0 : 2}
                                >
                                    {selectedItem.description}
                                </Text>
                                <Text style={[styles.toggleText, { marginTop: 5, color: '#FB902E' }]}>
                                    {expanded ? 'Show Less' : 'Read More'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.dividendsContainer}>
                            <Text style={styles.dividendsHeader}>Revenue received</Text>
                            {selectedItem.incomes?.map((income, index) => (
                                <View key={index} style={styles.dividendRow}>
                                    <Text style={styles.dividendMonth}>{income.date_received}</Text>
                                    <Text style={styles.dividendShare}>
                                        {formatCurrency(income.amount, income.currency)}
                                    </Text>
                                </View>
                            ))}
                            <View style={styles.dividendRow}>
                                <Text style={[styles.dividendShare, { color: '#FB902E' }]}>Total</Text>
                                <Text style={[styles.dividendShare, { color: '#FB902E' }]}>{formattedTotalIncome}</Text>
                            </View>
                        </View>
                        <View style={styles.dividendsContainer}>
                            <Text style={styles.dividendsHeader}>Expenses</Text>
                            {selectedItem.expenses?.map((expense, index) => (
                                <View key={index} style={styles.dividendRow}>
                                    <Text style={styles.dividendMonth}>{expense.date_incurred}</Text>
                                    <Text style={styles.dividendShare}>
                                        {formatCurrency(expense.amount, currency)}
                                    </Text>
                                </View>
                            ))}
                            <View style={styles.dividendRow}>
                                <Text style={[styles.dividendShare, { color: '#FB902E' }]}>Total</Text>
                                <Text style={[styles.dividendShare, { color: '#FB902E' }]}>{formattedTotalExpenses}</Text>
                            </View>
                        </View>
                        <View style={styles.dividendsContainer}>
                            <Text style={styles.dividendsHeader}>Net return</Text>
                            <View style={styles.dividendRow}>
                                <Text style={styles.dividendMonth}>Total income - Total expenses</Text>
                                <Text style={styles.dividendShare}>{formattedNetReturn}</Text>
                            </View>
                        </View>
                        <View style={styles.dividendsContainer}>
                            <Text style={styles.dividendsHeader}>Map Location</Text>
                        </View>
                        <MapViewer
                            // latitude={48.7758}
                            // longitude={9.1829}
                            title={selectedItem.title}
                            virtual_tour_url={selectedItem.virtual_tour_url}
                        />
                    </>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomSheetContent: {
        flex: 1,
        padding: 16,
        backgroundColor: '#358B8B1A',
    },
    header: {
        backgroundColor: '#358B8B1A',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        color: '#358B8B',
        fontWeight: 'bold',
    },
    closeIcon: {
        padding: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalLocation: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    map: {
        width: '100%',
        height: 200,
        marginTop: 20,
        borderRadius: 10,
    },
    buttonContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    toggleButton: {
        backgroundColor: '#FB902E',
        padding: 10,
        borderRadius: 5,
        width: '50%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    sellButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#358B8B',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },

    overview: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
    },
    propertyDetailText: {
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'left',
        textDecorationStyle: 'solid',
        textDecorationColor: 'black',
    },
    noMapView: {
        padding: 10
    },
    noMapText: {
        fontSize: 16
    },

    dividendsContainer: {
        marginTop: 20,
    },
    dividendsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dividendRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    dividendMonth: {
        fontSize: 14,
    },
    portfolioSummary: {
        fontSize: 14,
    },
    dividendShare: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    pagerView: {
        flex: 1,
        height: 100,
        marginVertical: 10
    },
    detailItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        margin: 10,
        elevation: 3,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    detailValue: {
        fontSize: 16,
        color: '#555',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#358B8B',
    },
    inactiveDot: {
        backgroundColor: '#D3D3D3',
    },

    excellent: {
        color: 'green',
    },
    good: {
        color: 'orange',
    },
    moderate: {
        color: 'yellow',
    },
    poor: {
        color: 'red',
    },
    positiveCashFlow: {
        color: 'green',
    },
    negativeCashFlow: {
        color: 'red',
    },

});

export default PropertyDetail;
