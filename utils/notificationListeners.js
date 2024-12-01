import * as Notifications from 'expo-notifications';


export function setupNotificationListeners() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });

    Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received in foreground:', notification);
    });

    Notifications.addNotificationResponseReceivedListener(response => {
        console.log('User interacted with the notification:', response);
    });
}
