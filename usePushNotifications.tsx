import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useGlobalContext } from './context/GlobalProvider';


export interface PushNotificationState {
    expoPushToken?: Notifications.ExpoPushToken;
    notification?: Notifications.Notification;
    enableNotifications: () => Promise<void>;
    disableNotifications: () => Promise<void>;
    getNotificationStatus: () => Promise<boolean>;
}

const API_BASE_URL = 'https://www.realvistamanagement.com/notifications';
const UNREGISTER_URL = 'https://www.brillianzhub.com/notifications/unregister-token/';


export const usePushNotifications = (): PushNotificationState => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: false,
            shouldShowAlert: true,
            shouldSetBadge: false,
        }),
    });

    const { user } = useGlobalContext();

    const userId = user.id;


    // const USER_TOKEN = AsyncStorage.getItem('authToken');

    // console.log(USER_TOKEN)

    const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken>();
    const [notification, setNotification] = useState<Notifications.Notification>();

    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    const registerForPushNotificationsAsync = async (): Promise<Notifications.ExpoPushToken | undefined> => {
        try {
            if (!Device.isDevice) {
                console.warn('Must be using a physical device for Push notifications');
                return;
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            const finalStatus = existingStatus === 'granted' ? existingStatus : (await Notifications.requestPermissionsAsync()).status;

            if (finalStatus !== 'granted') {
                console.error('Failed to get push token for notifications');
                return;
            }

            const token = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas.projectId,
            });

            if (!token) throw new Error('Failed to generate push token');

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            // Send the token to the backend
            await fetch(`${API_BASE_URL}/register-token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token.data,
                    user_id: userId
                }),
            });

            return token;
        } catch (error) {
            console.error('Error registering for push notifications:', error);
        }
    };

    const enableNotifications = async () => {
        const token = await registerForPushNotificationsAsync();
        if (token) setExpoPushToken(token);
    };

    const disableNotifications = async () => {
        try {
            if (expoPushToken) {
                await fetch(UNREGISTER_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: expoPushToken.data }),
                });
            }

            setExpoPushToken(undefined);
        } catch (error) {
            console.error('Error disabling notifications:', error);
        }
    };

    const getNotificationStatus = async (): Promise<boolean> => {
        return !!expoPushToken;
    };

    useEffect(() => {
        enableNotifications();

        notificationListener.current = Notifications.addNotificationReceivedListener(setNotification);
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notification Response:', response);
        });

        return () => {
            notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return {
        expoPushToken,
        notification,
        enableNotifications,
        disableNotifications,
        getNotificationStatus,
    };
};
