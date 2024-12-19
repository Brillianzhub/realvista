import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ManageMembersScreen({ route }) {
    const { groupId, role } = route.params; // Group ID and role passed from navigation
    const [members, setMembers] = useState([]);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch members of the group
    const fetchGroupMembers = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.get(`https://www.realvistamanagement.com/enterprise/group/${groupId}/members`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setMembers(response.data);
        } catch (error) {
            console.error('Error fetching group members:', error);
            Alert.alert('Error', 'Failed to fetch group members.');
        } finally {
            setLoading(false);
        }
    };


    const handleAddMember = async () => {
        if (!email.trim()) {
            Alert.alert('Validation Error', 'Please enter a valid email.');
            return;
        }

        // Check if the member already exists
        if (members.some((member) => member.email === email)) {
            Alert.alert('Duplicate Member', 'This member is already added.');
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.post(
                `https://www.realvistamanagement.com/enterprise/group/${groupId}/add-member/`,
                { email },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            Alert.alert('Success', 'Invitation sent successfully.');
            setEmail('');
        } catch (error) {
            console.error('Error inviting member:', error);
            Alert.alert('Error', 'Failed to send invitation. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchGroupMembers();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Group Members</Text>

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={members}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.memberItem}>
                            <Text style={styles.memberEmail}>{item.email}</Text>
                            <Text style={styles.memberRole}>Role: {item.role}</Text>
                        </View>
                    )}
                />
            )}

            {/* Show Add Member functionality only for Admins */}
            {role === 'ADMIN' && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Member Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Button title="Add Member" onPress={handleAddMember} disabled={loading} />
                </>
            )}
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
