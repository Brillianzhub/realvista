import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const UserInitials = ({ user, onPress }) => {
    const getInitials = () => {
        const fullName = user.name || ''; // Default to an empty string if `name` is not provided
        const firstName = user.first_name || ''; // Default to an empty string if `first_name` is not provided

        // Split names into parts
        const nameParts = fullName.trim().split(' ');
        const firstNameParts = firstName.trim().split(' ');

        // Determine which field to prioritize
        if (nameParts.length > 1) {
            // Use `name` if it has multiple words
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        } else if (firstNameParts.length > 1) {
            // Use `first_name` if it has multiple words
            return `${firstNameParts[0][0]}${firstNameParts[1][0]}`.toUpperCase();
        } else {
            // Combine initials from both fields if each has only one word
            const firstInitial = fullName.charAt(0).toUpperCase();
            const secondInitial = firstName.charAt(0).toUpperCase();
            return `${firstInitial}${secondInitial}` || ''; // Handle cases where both are empty
        }
    };

    return (
        <TouchableOpacity onPress={onPress} style={styles.circle}>
            <Text style={styles.initialsText}>{getInitials()}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    circle: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        backgroundColor: '#358B8B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UserInitials;
