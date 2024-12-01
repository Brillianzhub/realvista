import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNotifications } from '../../context/NotificationContext';


const Notifications = () => {
    const { notifications, markNotificationsAsRead } = useNotifications();

    useEffect(() => {
        // Mark notifications as read when this screen is opened
        markNotificationsAsRead();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Notifications</Text>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.notification}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.body}>{item.body}</Text>
                    </View>
                )}
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
});

export default Notifications;
