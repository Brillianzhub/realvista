import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';


const NotificationContext = createContext();


export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [hasUnread, setHasUnread] = useState(false);


    useEffect(() => {
        const loadStoredNotifications = async () => {
            try {
                const storedNotifications = await AsyncStorage.getItem('notifications');
                if (storedNotifications) {
                    const parsedNotifications = JSON.parse(storedNotifications);
                    setNotifications(parsedNotifications);

                    // Check for unread notifications
                    const unreadExists = parsedNotifications.some(notification => !notification.read);
                    setHasUnread(unreadExists);
                }
            } catch (error) {
                console.error('Failed to load notifications from storage:', error);
            }
        };

        loadStoredNotifications();
    }, []);


    const markNotificationsAsRead = async () => {
        const updatedNotifications = notifications.map(notification => ({
            ...notification,
            read: true,
        }));

        setNotifications(updatedNotifications);
        setHasUnread(false);

        await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    };

    // Save notifications to storage whenever they change
    useEffect(() => {
        const saveNotifications = async () => {
            try {
                await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
            } catch (error) {
                console.error('Failed to save notifications to storage:', error);
            }
        };

        if (notifications.length > 0) {
            saveNotifications();
        }
    }, [notifications]);

    // Set up notification listeners
    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received in foreground:', notification);

            setNotifications(prev => [
                ...prev,
                {
                    id: notification.request.identifier,
                    title: notification.request.content.title,
                    body: notification.request.content.body,
                    data: notification.request.content.data,
                },
            ]);
        });

        const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('User interacted with the notification:', response);
            const notification = response.notification;

            setNotifications(prev => [
                ...prev,
                {
                    id: notification.request.identifier,
                    title: notification.request.content.title,
                    body: notification.request.content.body,
                    data: notification.request.content.data,
                },
            ]);
        });

        return () => {
            subscription.remove();
            responseSubscription.remove();
        };
    }, []);

    return (
        <NotificationContext.Provider
            value={{ notifications, setNotifications, hasUnread, markNotificationsAsRead }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

// Use the context
export const useNotifications = () => useContext(NotificationContext);
