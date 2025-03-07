import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import useFetchUserListedProperties from '../../hooks/useFetchUserListedProperties';
import moment from 'moment';
import { router, useNavigation } from 'expo-router';


const ManageListingsScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const { properties, loading, setLoading, error, refetch } = useFetchUserListedProperties();

    const handleRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#358B8B" />;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }


    const renderItem = ({ item }) => {
        const formattedDate = moment(item.listed_date).format('DD-MM-YYYY');

        return (
            <TouchableOpacity
                style={styles.listingItem}
                onPress={() =>
                    router.push({
                        pathname: '/(marketlisting)/ManageListing',
                        params: { selectedListing: JSON.stringify(item) },
                    })
                }
            >
                <View>
                    <Text style={styles.listingTitle}>{item.title}</Text>
                    <Text style={{ color: 'gray', fontSize: 14 }}>{formattedDate}</Text>
                </View>
                <Text style={styles.listingViews}>{item.views} Views</Text>
            </TouchableOpacity>
        );
    };


    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Listings</Text>
            <FlatList
                data={properties}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listingsContainer}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
            <TouchableOpacity
                onPress={() => navigation.navigate('AddListing')}
                style={styles.addPropertyBtn}
            >
                <Text style={styles.addPropertyText}>Add New Listing</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ManageListingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'left',
    },
    listingsContainer: {
        paddingBottom: 16,
    },
    listingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 12,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 4,
        elevation: 2,
    },
    listingTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    listingViews: {
        fontSize: 14,
        color: '#666',
    },
    addPropertyBtn: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#FB902E',
        borderRadius: 4,
        alignItems: 'center',
    },
    addPropertyText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
