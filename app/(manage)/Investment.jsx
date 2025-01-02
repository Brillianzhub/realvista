import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert } from 'react-native';

const Investment = () => {

    const handleContactPress = () => {
        const contactEmail = 'weinvest@realvistaproperties.com';
        const subject = 'Interest in WeInvest Program';
        const body = 'Hello, I am interested in learning more about the WeInvest program.';
        const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        Linking.openURL(mailto).catch((err) => {
            console.error('An error occurred', err);
            Alert.alert(
                'Error',
                'Unable to open email client. Please ensure you have a mail application installed on your device.'
            );
        });
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the WeInvest Program</Text>
            <Text style={styles.description}>
                The WeInvest program is an exciting opportunity for individuals and partners to come together and
                invest in lucrative real estate projects. By pooling resources, we can unlock the potential of real estate
                investments that might otherwise be out of reach for individuals. Join us and become part of a thriving investment
                community!
            </Text>

            <Text style={styles.subtitle}>Why Join the WeInvest Program?</Text>
            <Text style={styles.benefits}>
                - Collaborate with like-minded investors{'\n'}
                - Access high-value real estate projects{'\n'}
                - Enjoy shared risk and increased returns{'\n'}
                - Be part of a transparent and trustworthy investment community
            </Text>

            <Text style={styles.footer}>
                Interested in learning more? Click the button below to contact us and find out how you can join the program.
            </Text>

            <TouchableOpacity style={styles.contactButton} onPress={handleContactPress}>
                <Text style={styles.contactButtonText}>Contact Us</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Investment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        lineHeight: 24,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    benefits: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        lineHeight: 24,
    },
    footer: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        lineHeight: 24,
        textAlign: 'center',
    },
    contactButton: {
        backgroundColor: '#FB902E',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
