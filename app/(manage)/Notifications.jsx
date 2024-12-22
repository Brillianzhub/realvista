import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNotifications } from '../../context/NotificationContext';

const Notifications = () => {
    const { notifications, markNotificationsAsRead } = useNotifications();

    useEffect(() => {
        markNotificationsAsRead();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Notifications</Text>
            <FlatList
                data={notifications || []} // Ensure notifications is never null
                keyExtractor={(item, index) => item?.id?.toString() || index.toString()} // Fallback to index if id is missing
                renderItem={({ item }) => (
                    <View style={styles.notification}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.body}>{item.body}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No notifications to show</Text>
                } // Render this if notifications is empty
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    notification: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    body: {
        fontSize: 14,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Notifications;