import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';

const MarketScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    const navigation = useNavigation();

    const [properties, setProperties] = useState([
        {
            id: 1,
            title: 'Luxury Apartment',
            location: 'New York',
            price: '500,000',
            image: 'https://via.placeholder.com/150',
            seller: 'John Doe',
            contact: 'johndoe@example.com',
        },
        {
            id: 2,
            title: 'Beachfront Villa',
            location: 'Miami',
            price: '1,200,000',
            image: 'https://via.placeholder.com/150',
            seller: 'Jane Smith',
            contact: 'janesmith@example.com',
        },
    ]);

    const filteredProperties = properties.filter((property) => {
        const matchesLocation = locationFilter
            ? property.location.toLowerCase().includes(locationFilter.toLowerCase())
            : true;
        const matchesPrice = priceFilter ? parseInt(property.price.replace(/,/g, '')) <= parseInt(priceFilter) : true;
        const matchesSearch = searchQuery
            ? property.title.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        return matchesLocation && matchesPrice && matchesSearch;
    });

    const handleContactSeller = (sellerContact) => {
        // Logic to contact the seller, e.g., navigate to an email form
        alert(`Contact seller at: ${sellerContact}`);
    };

    const renderProperty = ({ item }) => (
        <View style={styles.propertyCard}>
            <Image source={{ uri: item.image }} style={styles.propertyImage} />
            <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle}>{item.title}</Text>
                <Text style={styles.propertyDetails}>Location: {item.location}</Text>
                <Text style={styles.propertyDetails}>Price: ${item.price}</Text>
                <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => navigation.navigate('PropertyDetail', { propertyId: item.id })}
                >
                    <Text style={styles.contactButtonText}>Contact Seller</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Search Section */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search by title"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* Filter Section */}
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

            {/* Property List */}
            <FlatList
                data={filteredProperties}
                renderItem={renderProperty}
                keyExtractor={(item) => item.id}
                style={styles.propertiesList}
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
        backgroundColor: '#f9f9f9',
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
        backgroundColor: '#007BFF',
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
