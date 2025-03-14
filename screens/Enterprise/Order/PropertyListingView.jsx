import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapViewer from '@/components/MapViewer';
import { useCurrency } from '../../../context/CurrencyContext';
import { formatCurrency } from '../../../utils/formatCurrency';
import images from '@/constants/images';
import PropertyBooking from './PropertyBooking';
import FileRenderer from '../Details/FileRenderer';
import CoordinatesList from '../Details/CoordinatesList';
import ShareDistribution from '../Details/ShareDistribution';


const PropertyDetail = ({
    selectedItem,
    closeBottomSheet,
    role,
    groupId,
    uniqueGroupId,
    navigation,
    deviceTokens,
    onRefresh
}) => {
    if (!selectedItem) {
        return <View><Text>No data selected.</Text></View>;
    }
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const { currency } = useCurrency();
    const formattedInitialCost = formatCurrency(selectedItem.initial_cost, currency);


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
                                        <Text style={[styles.modalLocation, { color: '#FB902E' }]}>
                                            {selectedItem.location.charAt(0).toUpperCase() + selectedItem.location.slice(1)}, {' '}
                                            {selectedItem.city.charAt(0).toUpperCase() + selectedItem.city.slice(1)}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                    <Text style={styles.portfolioSummary}>Project Budget</Text>
                                    <Text style={[styles.portfolioSummary, { fontWeight: '600' }]}>{formattedInitialCost}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                    <Text style={styles.portfolioSummary}>Property Type</Text>
                                    <Text style={[styles.portfolioSummary, { fontWeight: '600' }]}>
                                        {selectedItem.property_type.charAt(0).toUpperCase() + selectedItem.property_type.slice(1)}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                    <Text style={styles.portfolioSummary}>Property Area</Text>
                                    <Text style={[styles.portfolioSummary, { fontWeight: '600' }]}>{selectedItem.area} sqm</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                    <Text style={styles.portfolioSummary}>Number of Slots</Text>
                                    <Text style={[styles.portfolioSummary, { fontWeight: '600' }]}>{selectedItem.total_slots}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                    <Text style={styles.portfolioSummary}>Available Slots</Text>
                                    <Text style={[styles.portfolioSummary, { fontWeight: '600' }]}>{selectedItem.available_slots}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                    <Text style={styles.portfolioSummary}>Price per slot</Text>
                                    <Text style={[styles.portfolioSummary, { fontWeight: '600' }]}>{formatCurrency(selectedItem.slot_price, currency)}</Text>
                                </View>
                            </View>
                        </View>
                        <PropertyBooking
                            property={selectedItem}
                            groupId={groupId}
                            uniqueGroupId={uniqueGroupId}
                            tokens={deviceTokens}
                            closeBottomSheet={closeBottomSheet}
                            onRefresh={onRefresh}
                            navigation={navigation}
                        />
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

                        <FileRenderer
                            files={selectedItem.files}
                            role={role}
                            onRefresh={onRefresh}
                            closeBottomSheet={closeBottomSheet}
                        />

                        {selectedItem.coordinates ? (
                            <View style={styles.dividendsContainer}>
                                <Text style={styles.dividendsHeader}>Map Location</Text>
                                <CoordinatesList
                                    coordinates={selectedItem.coordinates}
                                    role={role}
                                    onRefresh={onRefresh}
                                    closeBottomSheet={closeBottomSheet}
                                />
                            </View>
                        ) : null}

                        <MapViewer
                            latitude={selectedItem.coordinates.length > 0 ? selectedItem.coordinates[0].latitude : 0}
                            longitude={selectedItem.coordinates.length > 0 ? selectedItem.coordinates[0].longitude : 0}
                            title={selectedItem.title}
                        />

                        <ShareDistribution
                            property={selectedItem}
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
    overview: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
    },
    booking: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailContent: {
        marginTop: 20,
    },
    detailValue: {
        fontSize: 14,
        color: '#555',
        marginVertical: 4,
    },
    dividendsContainer: {
        marginTop: 20,
    },
    dividendsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    portfolioSummary: {
        fontSize: 14,
    },
    detailItem: {
        padding: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginTop: 20,
        elevation: 3,
    },

});

export default PropertyDetail;
