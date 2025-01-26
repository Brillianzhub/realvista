import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import useFetchProperties from "../hooks/useFetchProperties";
import { formatCurrency } from '../utils/formatCurrency';
import { useTheme } from '@/context/ThemeContext';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import MarketDetailScreen from './MarketDetailScreen';
import MarketPropertyList from './MarketPropertyList';
import SearchFilterModal from '@/components/SearchFilterModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const MarketScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const { properties, fetchProperties, loading, error } = useFetchProperties();
    const [selectedItem, setSelectedItem] = useState(null);

    const bottomSheetRef = useRef(null);
    const { colors } = useTheme();

    // const openBottomSheet = (item) => {
    //     setSelectedItem(item);
    //     console.log(item.id)
    //     bottomSheetRef.current?.expand();
    // };


    const openBottomSheet = (item) => {
        try {
            setSelectedItem(item);
            handleViewProperty(item.id);
            bottomSheetRef.current?.expand();
        } catch (error) {
            console.error('Error opening bottom sheet:', error);
        }
    };

    const handleViewProperty = async (propertyId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token is missing');
            }

            const response = await axios.get(
                `https://www.realvistamanagement.com/market/view-property/${propertyId}/`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

        } catch (error) {
            console.error('Error viewing property:', error.response?.data || error.message);
        }
    };

    const closeBottomSheet = () => {
        bottomSheetRef.current?.close();
        setSelectedItem(null);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProperties();
        setRefreshing(false);
    };

    const filteredProperties = properties.filter((property) => {
        const matchesLocation = locationFilter
            ? property.city.toLowerCase().includes(locationFilter.toLowerCase())
            : true;
        const matchesPrice = priceFilter
            ? parseInt(property.price.replace(/,/g, '')) <= parseInt(priceFilter)
            : true;
        const matchesSearch = searchQuery
            ? property.title.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        return matchesLocation && matchesPrice && matchesSearch;
    });

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#358B8B" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchProperties} style={styles.retryButton}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={filteredProperties}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <MarketPropertyList
                        properties={[item]}
                        openBottomSheet={openBottomSheet}
                        formatCurrency={formatCurrency}
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#358B8B"]}
                    />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No properties found. Try adjusting your filters.</Text>
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setIsModalVisible(true)}
            >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Filter</Text>
            </TouchableOpacity>

            <SearchFilterModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                locationFilter={locationFilter}
                setLocationFilter={setLocationFilter}
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
            />

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={['25%', '50%', '100%']}
                enablePanDownToClose={true}
                onClose={closeBottomSheet}
                handleStyle={styles.handleContainer}
                handleIndicatorStyle={styles.handleIndicator}
            >
                <BottomSheetScrollView
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <MarketDetailScreen
                        selectedItem={selectedItem}
                        closeBottomSheet={closeBottomSheet}
                    />
                </BottomSheetScrollView>
            </BottomSheet>
        </View>
    );
};

export default MarketScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 20,
    },
    listContainer: {
        paddingBottom: 50,
    },
    retryButton: {
        padding: 10,
        backgroundColor: '#358B8B',
        borderRadius: 5,
    },
    retryText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
        fontSize: 16,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#FB902E',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },

    handleIndicator: {
        backgroundColor: '#358B8B',
        width: 50,
        height: 5,
        borderRadius: 3,
    },
    handleContainer: {
        backgroundColor: '#358B8B1A',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
});
