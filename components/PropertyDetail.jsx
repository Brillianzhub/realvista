import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PagerView from 'react-native-pager-view';
import MapViewer from '../components/MapViewer';

const PropertyDetail = ({
    selectedItem,
    closeBottomSheet,
    toggleMapType,
    mapType,
}) => {
    if (!selectedItem) {
        return <View><Text>No data selected.</Text></View>;
    }

    const [currentValue, setCurrentValue] = useState(0);
    const [percentageReturn, setPercentageReturn] = useState(0);

    const { project, dividends = [], amount = 0, slots } = selectedItem;
    const [currentPage, setCurrentPage] = useState(0);


    const processedShares = useMemo(() => {
        return dividends.flatMap(dividend =>
            dividend.shares.map(share => ({
                month: dividend.month,
                finalShareAmount: parseFloat(share.final_share_amount).toFixed(2),
            }))
        );
    }, [dividends]);


    useEffect(() => {
        if (!dividends || dividends.length === 0) return;

        const totalDividendSum = dividends.reduce((sum, dividend) => {
            const sharesSum = dividend.shares.reduce(
                (shareSum, share) => shareSum + parseFloat(share.final_share_amount || 0),
                0
            );
            return sum + sharesSum;
        }, 0);

        const totalInvestment = parseFloat(amount || 0);

        const currentValue = totalInvestment + totalDividendSum;
        setCurrentValue(currentValue);

        const percentReturn = totalInvestment > 0
            ? ((currentValue - totalInvestment) / totalInvestment) * 100
            : 0;

        setPercentageReturn(percentReturn.toFixed(2));
    }, [dividends, amount]);

    const items = [
        { label: 'No. of Slots Owned', value: slots },
        { label: 'Cost per Slot', value: `${project.cost_per_slot}` },
        { label: 'Date Created', value: new Date(selectedItem.created_at).toLocaleDateString() },
        { label: 'Example Item', value: 'Example Value' },
    ];


    return (
        <ScrollView
            nestedScrollEnabled={true}
            contentContainerStyle={{ flex: 1 }}
        >
            {/* <View style={styles.container}> */}
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
                                <View style={{ marginVertical: 10 }}>
                                    <Text style={[styles.modalTitle, { color: '#358B8B' }]}>REF: {project?.project_reference}</Text>
                                </View>
                                <Text style={styles.modalTitle}>{project?.name}</Text>

                                <Text style={[styles.modalTitle, { color: '#FB902E' }]}>{project.location}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                <Text style={styles.propertyDetailText}>Initial Investment:</Text>
                                <Text style={[styles.propertyDetailText, { fontWeight: '600' }]}>${amount}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                <Text style={styles.propertyDetailText}>Current Value:</Text>
                                <Text style={[styles.propertyDetailText, { fontWeight: '600' }]}>${currentValue}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                <Text style={styles.propertyDetailText}>Percentage Return:</Text>
                                <Text style={[styles.propertyDetailText, { fontWeight: '600' }]}>{percentageReturn}%</Text>
                            </View>
                            <Text style={styles.propertyDetailText}>{selectedItem.description}</Text>
                        </View>

                        <PagerView
                            style={styles.pagerView}
                            initialPage={0}
                            onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
                        >
                            {items.map((item, index) => (
                                <View key={index} style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>{item.label}</Text>
                                    <Text style={styles.detailValue}>{item.value}</Text>
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
                            <Text style={styles.dividendsHeader}>Dividends</Text>
                            {processedShares.map((share, index) => (
                                <View key={index} style={styles.dividendRow}>
                                    <Text style={styles.dividendMonth}>{share.month}</Text>
                                    <Text style={styles.dividendShare}>${share.finalShareAmount}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.dividendsContainer}>
                            <Text style={styles.dividendsHeader}>Map Location</Text>
                        </View>
                        <MapViewer
                            latitude={48.7758}
                            longitude={9.1829}
                            title={project.name}
                            description={project.location}
                            mapType={mapType}
                        />
                    </>
                )}
                <View style={styles.buttonContainer}>
                    <Pressable onPress={toggleMapType} style={styles.toggleButton}>
                        <Text style={styles.buttonText}>Toggle Map</Text>
                    </Pressable>
                </View>
                <TouchableOpacity style={styles.sellButton} onPress={() => alert('Sell Property')}>
                    <Text style={[styles.buttonText, { fontSize: 20 }]}>Sell</Text>
                </TouchableOpacity>
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

});

export default PropertyDetail;
