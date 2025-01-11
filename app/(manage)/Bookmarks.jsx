import { StyleSheet, Text, View, ActivityIndicator, FlatList, Button, RefreshControl } from 'react-native';
import React, { useCallback } from 'react';
import useUserBookmarks from '../../hooks/useUserBookmark';

const Bookmarks = () => {
    const { bookmarks, loading, setLoading, error, fetchBookmarks } = useUserBookmarks();

    const handleReload = useCallback(() => {
        setLoading(true);
        fetchBookmarks();
    }, [fetchBookmarks, setLoading]);

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
                <Text style={styles.errorText}>Error: {error}</Text>
                <Button title="Retry" onPress={handleReload} color="#358B8B" />
            </View>
        );
    }

    if (bookmarks.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>No bookmarks found.</Text>
                <Button title="Reload" onPress={handleReload} color="#358B8B" />
            </View>
        );
    }

    return (
        <FlatList
            data={bookmarks}
            keyExtractor={(item) => item.property_id.toString()}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.address}>{item.address}</Text>
                </View>
            )}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={handleReload}
                    colors={['#358B8B']}
                />
            }
        />
    );
}

export default Bookmarks;

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#6c757d',
        fontSize: 16,
        fontStyle: 'italic',
    },
    listContainer: {
        padding: 10,
        backgroundColor: '#f8f9fa',
    },
    card: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#343a40',
    },
    address: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 5,
    },
});
