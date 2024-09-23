import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';

const NavigationView = () => {
    return (
        <View style={styles.container}>
            {/* Placeholder for logo */}
            <Image
                source={{ uri: 'https://your-logo-url.com/logo.png' }} // Replace with your logo URL
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>Menu</Text>

            {/* Menu Items */}
            <TouchableOpacity onPress={() => alert('Go to Settings')} style={styles.menuItem}>
                <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => alert('Go to Profile')} style={styles.menuItem}>
                <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => alert('Logout')} style={styles.menuItem}>
                <Text style={styles.menuText}>Logout</Text>
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
