import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

export default function ManageMembersScreen() {
    const [members, setMembers] = useState([
        { id: 1, email: 'admin@example.com', role: 'Admin' },
        { id: 2, email: 'user1@example.com', role: 'Member' },
        { id: 3, email: 'user2@example.com', role: 'Member' },
    ]);
    const [email, setEmail] = useState('');

    const handleAddMember = () => {
        if (!email) {
            alert('Please enter an email.');
            return;
        }

        // Check if email already exists
        if (members.some((member) => member.email === email)) {
            alert('This member is already added.');
            return;
        }

        // Add new member to the list
        const newMember = {
            id: members.length + 1, // Generate a new ID
            email: email,
            role: 'Member',
        };

        setMembers((prevMembers) => [...prevMembers, newMember]);
        setEmail(''); // Clear input field
        alert('Member Added');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Members</Text>

            {/* Member List */}
            <FlatList
                data={members}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.memberItem}>
                        <Text style={styles.memberEmail}>{item.email}</Text>
                        <Text style={styles.memberRole}>{item.role}</Text>
                    </View>
                )}
            />

            {/* Add Member */}
            <TextInput
                style={styles.input}
                placeholder="Enter Member Email"
                value={email}
                onChangeText={setEmail}
            />
            <Button title="Add Member" onPress={handleAddMember} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    memberItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    memberEmail: {
        fontSize: 16,
    },
    memberRole: {
        fontSize: 16,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});
