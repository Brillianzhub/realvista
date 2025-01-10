import { Alert } from "react-native";

export const sendNotification = async ({ title, messageData, deviceTokens }) => {
    if (!deviceTokens || (Array.isArray(deviceTokens) && deviceTokens.length === 0)) {
        Alert.alert('Notification Error', 'Device tokens are required.');
        console.error('Error: Device tokens are missing.');
        return;
    }

    const notificationPayload = {
        title: title,
        message: `${messageData.sender} ${messageData.text}`,
        data: {
            senderEmail: messageData.senderEmail,
        },
        deviceTokens: Array.isArray(deviceTokens) ? deviceTokens : [deviceTokens], 
    };

    try {
        const response = await fetch('https://www.realvistamanagement.com/notifications/send-notification/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notificationPayload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to send notification: ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        Alert.alert('Notification Error', error.message);
        console.error('Error sending notification:', error);
        throw error;
    }
};
