import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';

const MemberItem = ({ item, role, onMakeAdmin, onRemoveAdmin, onRemoveUser }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const handleRemoveUser = () => {
        setConfirmModalVisible(true); // Show confirmation modal
        closeMenu(); // Close the menu dropdown
    };

    const confirmRemoveUser = () => {
        onRemoveUser(item.id); // Call the parent function to remove the user
        setConfirmModalVisible(false); // Close the confirmation modal
    };

    return (
        <View style={styles.memberItem}>
            <Image
                source={item.user_avatar ? { uri: item.user_avatar } : { uri: 'https://via.placeholder.com/150' }}
                style={styles.memberAvatar}
            />
            <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{item.name}</Text>
                <Text style={styles.memberEmail}>{item.email}</Text>
                <Text style={styles.memberRole}>{item.role}</Text>
                <Text style={styles.memberJoinedAt}>Joined: {new Date(item.joined_at).toLocaleDateString()}</Text>
            </View>

            {(role === 'SUPERADMIN' || role === 'ADMIN') && (
                <View style={styles.menuContainer}>
                    <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
                        <Text style={styles.menuIcon}>⋮</Text>
                    </TouchableOpacity>

                    {/* Menu Dropdown */}
                    <Modal
                        visible={menuVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={closeMenu}
                    >
                        <TouchableOpacity style={styles.overlay} onPress={closeMenu} activeOpacity={1}>
                            <View style={styles.menuDropdown}>
                                {item.role === 'MEMBER' && (
                                    <TouchableOpacity style={styles.menuItem} onPress={() => {
                                        onMakeAdmin(item.id);
                                        closeMenu();
                                    }}>
                                        <Text style={styles.menuText}>Make Admin</Text>
                                    </TouchableOpacity>
                                )}
                                {item.role === 'ADMIN' && (
                                    <TouchableOpacity style={styles.menuItem} onPress={() => {
                                        onRemoveAdmin(item.id);
                                        closeMenu();
                                    }}>
                                        <Text style={styles.menuText}>Remove Admin</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity style={styles.menuItem} onPress={handleRemoveUser}>
                                    <Text style={styles.menuText}>Remove User</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Modal>

                    {/* Confirmation Modal */}
                    <Modal
                        visible={confirmModalVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setConfirmModalVisible(false)}
                    >
                        <View style={styles.confirmModalOverlay}>
                            <View style={styles.confirmModalContent}>
                                <Text style={styles.confirmModalText}>
                                    Are you sure you want to remove this user?
                                    Ensure all data associated with the user has been removed before continuing, as this action may affect other data within your group. This process is irreversible.
                                </Text>

                                <View style={styles.confirmModalButtons}>
                                    <TouchableOpacity
                                        style={styles.confirmModalButton}
                                        onPress={() => setConfirmModalVisible(false)}
                                    >
                                        <Text style={styles.confirmModalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.confirmModalButton, styles.confirmModalButtonRemove]}
                                        onPress={confirmRemoveUser}
                                    >
                                        <Text style={styles.confirmModalButtonText}>Remove</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    memberAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    memberEmail: {
        fontSize: 14,
        color: '#666',
    },
    memberRole: {
        fontSize: 14,
        color: '#666',
    },
    memberJoinedAt: {
        fontSize: 12,
        color: '#999',
    },
    menuContainer: {
        position: 'relative',
    },
    menuButton: {
        padding: 10,
    },
    menuIcon: {
        fontSize: 24,
        color: '#333',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Dim the background
    },
    menuDropdown: {
        position: 'absolute',
        top: '50%', // Adjust positioning
        right: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        width: 150,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    menuText: {
        fontSize: 16,
        color: '#333',
    },
    confirmModalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    confirmModalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    confirmModalText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    confirmModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    confirmModalButton: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: '#e0e0e0',
    },
    confirmModalButtonRemove: {
        backgroundColor: '#FB902E',
    },
    confirmModalButtonText: {
        fontSize: 16,
        color: '#333',
    },
});

export default MemberItem;