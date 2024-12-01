
import { registerForPushNotificationsAsync } from './notificationsRegister';
import { setupNotificationListeners } from './notificationListeners';


async function sendPushTokenToBackend(token) {
    try {
        const response = await fetch('https://www.realvistamanagement.com/notifications/register-token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Push token successfully sent to backend:', data);
        } else {
            console.error('Failed to send push token to backend:', data);
        }
    } catch (error) {
        console.error('Error sending push token to backend:', error);
    }
}


export async function initializePushNotifications() {
    try {
        // Register for push notifications and get the token
        const token = await registerForPushNotificationsAsync();

        if (!token) {
            console.error('Failed to get a push token!');
            return;
        }

        // Set up notification listeners
        setupNotificationListeners();

        // Optional: You can send the token to your backend here
        await sendPushTokenToBackend(token);

    } catch (error) {
        console.error('Error initializing push notifications:', error);
    }
}