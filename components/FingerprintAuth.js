import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

const FingerprintAuth = ({ onSuccess, onFailure }) => {
    const authenticate = async () => {
        try {
            const isBiometricAvailable = await LocalAuthentication.isEnrolledAsync();
            if (!isBiometricAvailable) {
                Alert.alert('Error', 'No biometrics registered on this device.');
                onFailure && onFailure();
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate with Fingerprint',
                fallbackLabel: 'Use Passcode',
            });

            if (result.success) {
                onSuccess && onSuccess();
            } else {
                // Alert.alert('Error', 'Authentication failed.');
                onFailure && onFailure();
            }
        } catch (error) {
            console.error('Authentication error:', error);
            Alert.alert('Error', 'An unexpected error occurred.');
            onFailure && onFailure();
        }
    };

    return { authenticate };
};

export default FingerprintAuth;
