import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PagerView from 'react-native-pager-view';
import MapViewer from '../components/MapViewer';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';


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

    const formattedInitialCost = formatCurrency(selectedItem.initial_cost, currency);
    const formattedCurrentCost = formatCurrency(selectedItem.current_value, currency);


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


    // const items = [
    //     { label: 'No. of Slots Owned', value: slots },
    //     { label: 'Cost per Slot', value: `${project?.cost_per_slot}` },
    //     { label: 'Date Created', value: new Date(selectedItem.created_at).toLocaleDateString() },
    //     { label: 'Example Item', value: 'Example Value' },
    // ];


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
                                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                                <Text style={[styles.modalTitle, { color: '#FB902E' }]}>{selectedItem.location}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                <Text style={styles.propertyDetailText}>Initial Investment:</Text>
                                <Text style={[styles.propertyDetailText, { fontWeight: '600' }]}>{formattedInitialCost}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                <Text style={styles.propertyDetailText}>Current Value:</Text>
                                <Text style={[styles.propertyDetailText, { fontWeight: '600' }]}>{formattedCurrentCost}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                <Text style={styles.propertyDetailText}>Percentage Return:</Text>
                                <Text style={[styles.propertyDetailText, { fontWeight: '600' }]}>{selectedItem.percentageReturn}%</Text>
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
                                    numberOfLines={expanded ? 0 : 2} // 0 removes the limit
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
                            {selectedItem.incomes?.map((share, index) => (
                                <View key={index} style={styles.dividendRow}>
                                    <Text style={styles.dividendMonth}>{share.date_received}</Text>
                                    <Text style={styles.dividendShare}>${share.amount}</Text>
                                </View>
                            ))}
                            <View style={styles.dividendRow}>
                                <Text style={[styles.dividendShare, { color: '#FB902E' }]}>Total</Text>
                                <Text style={[styles.dividendShare, { color: '#FB902E' }]}>{selectedItem.totalIncome}</Text>
                            </View>
                        </View>
                        <View style={styles.dividendsContainer}>
                            <Text style={styles.dividendsHeader}>Expenses</Text>
                            {selectedItem.expenses?.map((share, index) => (
                                <View key={index} style={styles.dividendRow}>
                                    <Text style={styles.dividendMonth}>{share.date_incurred}</Text>
                                    <Text style={styles.dividendShare}>${share.amount}</Text>
                                </View>
                            ))}
                            <View style={styles.dividendRow}>
                                <Text style={[styles.dividendShare, { color: '#FB902E' }]}>Total</Text>
                                <Text style={[styles.dividendShare, { color: '#FB902E' }]}>{selectedItem.totalExpenses}</Text>
                            </View>
                        </View>
                        <View style={styles.dividendsContainer}>
                            <Text style={styles.dividendsHeader}>Net return</Text>
                            <View style={styles.dividendRow}>
                                <Text style={styles.dividendMonth}>Total income - Total expenses</Text>
                                <Text style={styles.dividendShare}>${selectedItem.netReturn}</Text>
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
            {/* </View> */}
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
        backgroundColor: '#358B8B', // Set your desired background color
        width: 60, // Set the width of the circle
        height: 60, // Set the height of the circle
        borderRadius: 30, // Make the button circular by setting borderRadius to half the width/height
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
        color: 'green', // Green for excellent investment health
    },
    good: {
        color: 'orange', // Orange for good investment health
    },
    moderate: {
        color: 'yellow', // Yellow for moderate investment health
    },
    poor: {
        color: 'red', // Red for poor investment health
    },
    positiveCashFlow: {
        color: 'green', // Green for positive cash flow
    },
    negativeCashFlow: {
        color: 'red', // Red for negative cash flow
    },

});

export default PropertyDetail;
