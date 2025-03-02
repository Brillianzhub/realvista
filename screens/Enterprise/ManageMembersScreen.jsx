import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MemberItem from './Manage/MemberItem'; // Import the MemberItem component

export default function ManageMembersScreen({ route }) {
    const { groupId, role } = route.params;
    const [members, setMembers] = useState([]);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchGroupMembers = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.get(`https://www.realvistamanagement.com/enterprise/groups/${groupId}/members`, {
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
        if (members.some((member) => member.email === email)) {
            Alert.alert('Duplicate Member', 'This member is already added.');
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.post(
                `https://www.realvistamanagement.com/enterprise/groups/${groupId}/add-member/`,
                { email },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            Alert.alert('Success', 'Invitation sent successfully.');
            setEmail('');
            fetchGroupMembers();
        } catch (error) {
            console.error('Error inviting member:', error);
            Alert.alert('Error', 'Failed to send invitation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMakeAdmin = async (memberId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.post(
                `https://www.realvistamanagement.com/enterprise/members/${groupId}/make-admin/`,
                { member_id: memberId },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            Alert.alert("Success", "User promoted to admin.");
            fetchGroupMembers(); // Refresh the list
        } catch (error) {
            console.error("Error making admin:", error);
            Alert.alert("Error", "Failed to make user admin.");
        }
    };



    const handleRemoveAdmin = async (userId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            await axios.post(
                `https://www.realvistamanagement.com/enterprise/members/${groupId}/remove-admin/`,
                { user_id: userId },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            Alert.alert('Success', 'Admin status removed.');
            fetchGroupMembers(); // Refresh the list
        } catch (error) {
            console.error('Error removing admin:', error);
            Alert.alert('Error', 'Failed to remove admin status.');
        }
    };


    const handleRemoveUser = async (memberId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert('Error', 'Authentication token is missing.');
                return;
            }

            await axios.delete(
                `https://www.realvistamanagement.com/enterprise/members/${groupId}/remove-user/`,
                {
                    data: { member_id: memberId }, 
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            Alert.alert('Success', 'User has been removed from the corporate entity.');
            fetchGroupMembers();
        } catch (error) {
            console.error('Error removing user:', error);
            Alert.alert('Error', 'Failed to remove user.');
        }
    };


    useEffect(() => {
        fetchGroupMembers();
    }, []);

    return (
        <View style={styles.container}>

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={members}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <MemberItem
                            item={item}
                            role={role}
                            onMakeAdmin={handleMakeAdmin}
                            onRemoveAdmin={handleRemoveAdmin}
                            onRemoveUser={handleRemoveUser}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {(role === 'SUPERADMIN' || role === 'ADMIN') && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Member Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TouchableOpacity style={styles.addMemberButton} onPress={handleAddMember} disabled={loading}>
                        <Text style={styles.addMemberButtonText}>Invite new member</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    addMemberButton: {
        backgroundColor: '#FB902E',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    addMemberButtonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});