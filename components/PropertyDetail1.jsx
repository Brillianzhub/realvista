import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';


const PropertyDetail = ({ bottomSheetRef, selectedItem, closeBottomSheet, toggleMapType, mapType }) => {
    const mapRef = useRef(null);

    if (!selectedItem) return null;
    const { project, dividends, total_amount, quantity, order_reference, payment_status } = selectedItem;

    const snapPoints = ['50%', '100%'];

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onClose={closeBottomSheet}
            enableContentPanningGesture={true}
            handleStyle={styles.handleContainer}
            handleIndicatorStyle={styles.handleIndicator}
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
                                <Text style={styles.modalTitle}>{selectedItem.project?.name}</Text>
                                <Text style={[styles.modalTitle, { color: '#FB902E' }]}>{selectedItem.project.location}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                <Text style={styles.propertyDetailText}>Initial Investment:</Text>
                                <Text style={[styles.propertyDetailText, { fontWeight: '600' }]}>${selectedItem.total_amount}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                <Text style={styles.propertyDetailText}>Current Value:</Text>
                                <Text style={[styles.propertyDetailText, { fontWeight: '600' }]}>$450</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                <Text style={styles.propertyDetailText}>Percentage Return:</Text>
                                <Text style={[styles.propertyDetailText, { fontWeight: '600' }]}>23%</Text>
                            </View>
                            <Text style={styles.propertyDetailText}>{selectedItem.description}</Text>
                        </View>

                        <View style={styles.dividendsContainer}>
                            <Text style={styles.dividendsHeader}>Dividends</Text>
                            {dividends.map((dividend, index) => (
                                <View key={index} style={styles.dividendRow}>
                                    <Text style={styles.dividendMonth}>{dividend.month}</Text>
                                    <Text style={styles.dividendShare}>${dividend.user_share.toFixed(2)}</Text>
                                </View>
                            ))}
                        </View>


                        {selectedItem.coordinates && selectedItem.coordinates.length > 0 &&
                            selectedItem.coordinates[0].latitude && selectedItem.coordinates[0].longitude ? (
                            <MapView
                                ref={mapRef}
                                style={styles.map}
                                mapType={mapType}
                                initialRegion={{
                                    latitude: selectedItem.coordinates[0].latitude,
                                    longitude: selectedItem.coordinates[0].longitude,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                }}
                                showsUserLocation={true}
                                zoomEnabled={true}
                                scrollEnabled={true}
                                pitchEnabled={true}
                            >
                                <Marker
                                    coordinate={selectedItem.coordinates[0]}
                                    title={selectedItem.location}
                                />
                                <Polygon
                                    coordinates={selectedItem.coordinates}
                                    fillColor="rgba(0, 200, 0, 0.3)"
                                    strokeColor="rgba(0,0,0,0.5)"
                                    strokeWidth={2}
                                />
                            </MapView>
                        ) : (
                            <View style={styles.noMapView}>
                                <Text style={styles.noMapText}>Map data not available for this property</Text>
                            </View>
                        )}
                    </>
                )}
                <View style={styles.buttonContainer}>
                    <Pressable onPress={toggleMapType} style={styles.toggleButton}>
                        <Text style={styles.buttonText}>Toggle Map</Text>
                    </Pressable>
                </View>
            </View>
        </BottomSheet>

    );
};

export default PropertyDetail;

const styles = StyleSheet.create({
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
        // elevation: 2, // Slight elevation for effect
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
        marginTop: 20,
        alignItems: 'center',
    },
    toggleButton: {
        backgroundColor: '#136e8b',
        padding: 10,
        borderRadius: 5,
        width: '50%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },

    handleContainer: {
        backgroundColor: '#358B8B1A',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
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
});
