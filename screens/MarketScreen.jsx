import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import useFetchProperties from "../hooks/useFetchProperties";
import { formatCurrency } from '../utils/formatCurrency';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/context/ThemeContext';


const MarketScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const { properties, loading, error } = useFetchProperties();
    const navigation = useNavigation();
    const { colors } = useTheme();


    const filteredProperties = properties.filter((property) => {
        const matchesLocation = locationFilter
            ? property.city.toLowerCase().includes(locationFilter.toLowerCase())
            : true;
        const matchesPrice = priceFilter ? parseInt(property.price.replace(/,/g, '')) <= parseInt(priceFilter) : true;
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
            </View>
        );
    }

    const renderProperty = ({ item }) => {
        const handleViewProperty = async (propertyId) => {
            try {

                const token = await AsyncStorage.getItem('authToken');
                await axios.get(`https://www.realvistamanagement.com/market/view-property/${propertyId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                navigation.navigate('PropertyDetail', { property: item });
            } catch (error) {
                console.error('Error viewing property:', error.response?.data || error.message);
            }
        };

        return (
            <View style={styles.propertyCard}>
                <Image
                    source={{ uri: item.image || 'https://via.placeholder.com/150' }}
                    style={styles.propertyImage}
                />
                <View style={styles.propertyInfo}>
                    <Text style={styles.propertyTitle}>{item.title}</Text>
                    <Text style={styles.propertyDetails}>
                        Location: {item.city}, {item.state}
                    </Text>
                    <Text style={styles.propertyDetails}>
                        Price: {formatCurrency(item.price, item.currency)}
                    </Text>
                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={() => handleViewProperty(item.id)}
                    >
                        <Text style={styles.contactButtonText}>View Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };



    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search by title"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <View style={styles.filtersContainer}>
                <TextInput
                    style={styles.filterInput}
                    placeholder="Filter by location"
                    value={locationFilter}
                    onChangeText={setLocationFilter}
                />
                <TextInput
                    style={styles.filterInput}
                    placeholder="Filter by max price"
                    value={priceFilter}
                    keyboardType="numeric"
                    onChangeText={setPriceFilter}
                />
            </View>

            <FlatList
                data={filteredProperties}
                renderItem={renderProperty}
                keyExtractor={(item) => item.id}
                style={styles.propertiesList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={styles.emptyText}>No properties found</Text>}
            />
        </View>
    );
};

export default MarketScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    filterInput: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginHorizontal: 4,
    },
    propertiesList: {
        flex: 1,
    },
    propertyCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
    },
    propertyImage: {
        width: 100,
        height: 100,
    },
    propertyInfo: {
        flex: 1,
        padding: 8,
    },
    propertyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    propertyDetails: {
        fontSize: 14,
        marginBottom: 4,
        color: '#555',
    },
    contactButton: {
        backgroundColor: '#FB902E',
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 8,
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        color: '#777',
        fontSize: 16,
        marginTop: 32,
    },
});
