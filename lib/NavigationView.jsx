import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { router } from 'expo-router';


const NavigationView = () => {

    const navigateTo = (route) => {
        router.replace(route);
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://your-logo-url.com/logo.png' }}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>Menu</Text>

            <TouchableOpacity onPress={() => router.push('/manage_property')} style={styles.menuItem}>
                <Text style={styles.menuText}>Manage Properties</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/profile')} style={styles.menuItem}>
                <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/settings')} style={styles.menuItem}>
                <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
        </View>
    );
};

export default NavigationView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    logo: {
        width: '100%', // Adjust width as needed
        height: 60, // Set height for the logo
        marginBottom: 20, // Space between logo and title
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 10, // Add top margin to prevent overlap with the status bar
    },
    menuItem: {
        marginVertical: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    menuText: {
        fontSize: 18,
    },
});
