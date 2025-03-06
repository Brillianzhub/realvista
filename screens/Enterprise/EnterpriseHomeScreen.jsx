import React, { useRef, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    TextInput,
    Modal,
    Linking,
    Alert,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Welcome to our Mutual Investment Platform! 🌟',
        description:
            'Discover the power of group investments—join forces with others to co-invest in high-value properties.',
        image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+1',
    },
    {
        id: '2',
        title: 'Co-Invest in Properties',
        description:
            'Share expenses and enjoy collective dividends while building your real estate portfolio.',
        image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+2',
    },
    {
        id: '3',
        title: 'Achieve Financial Goals Together',
        description:
            'Group funding opens doors to countless opportunities in the real estate market.',
        image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+3',
    },
    {
        id: '4',
        title: 'Start Your Journey Today!',
        description:
            'Join a group or create one to take the first step toward shared success.',
        image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+4',
    },
];

const StoryFeature = () => {
    const navigation = useNavigation();
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { user, fetchGroups } = useGlobalContext();
    const { groups } = user;
    const [refreshing, setRefreshing] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === slides.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index: currentIndex,
                animated: true,
            });
        }
    }, [currentIndex]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchGroups();
        setRefreshing(false);
    };


    const handleJoinGroup = async () => {
        if (!token.trim()) {
            Alert.alert('Error', 'Please paste a valid token.');
            return;
        }
        setLoading(true);
        try {
            const authToken = await AsyncStorage.getItem('authToken')
            if (!authToken.trim()) {
                Alert.alert('Error', 'Please paste a valid token.');
                return;
            }
            const response = await fetch('https://www.realvistamanagement.com/enterprise/groups/join/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${authToken}`,
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', data.detail || 'You have successfully joined the group!');
                setModalVisible(false);
                setToken('');
            } else {
                Alert.alert('Error', data.detail || 'Failed to join the group. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            console.error('Join Group Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateGroup = (groupId, name, description) => {
        navigation.navigate('CreateEnterprise', { groupId, name, description });
    };


    const handleDeleteGroup = async (groupId) => {
        Alert.alert(
            'Delete Group',
            'Are you sure you want to delete this group? All data associated with this group will be permanently deleted and cannot be recovered.', // Message
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const authToken = await AsyncStorage.getItem('authToken');
                            if (!authToken?.trim()) {
                                Alert.alert('Error', 'Authentication token is missing or invalid.');
                                return;
                            }

                            const response = await fetch(
                                `https://www.realvistamanagement.com/enterprise/delete-group/${groupId}/`,
                                {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Token ${authToken}`,
                                    },
                                }
                            );

                            if (response.ok) {
                                Alert.alert('Success', 'Group deleted successfully!');
                                fetchGroups();
                            } else {
                                const data = await response.json();
                                Alert.alert('Error', data.detail || 'Failed to delete the group. Please try again.');
                            }
                        } catch (error) {
                            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
                            console.error('Delete Group Error:', error);
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
        >
            <View style={{ height: height * 0.3 }}>
                <FlatList
                    ref={flatListRef}
                    data={slides}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <ImageBackground source={{ uri: item.image }} style={styles.slide}>
                            <View style={styles.overlay}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </ImageBackground>
                    )}
                />
            </View>
            <View style={styles.groupContainer}>
                {groups?.length > 0 &&
                    groups.map((item) => (
                        <View key={item.group.id} style={styles.groupItem}>
                            <TouchableOpacity
                                style={styles.groupInfo}
                                onPress={() =>
                                    navigation.navigate('GroupDashboard', {
                                        groupId: item.group.id,
                                        uniqueGroupId: item.group.group_id,
                                        role: item.role,
                                    })
                                }
                            >
                                <Text style={styles.groupName}>{item.group.name}</Text>
                                <Text style={styles.groupDate}>
                                    Created on: {new Date(item.group.created_at).toLocaleDateString()}
                                </Text>
                                <Text style={styles.groupDescription}>{item.group.description}</Text>

                            </TouchableOpacity>

                            {/* Conditionally render the menu button for SUPERADMIN only */}
                            {item.role === 'SUPERADMIN' && (
                                <Menu>
                                    <MenuTrigger>
                                        <Icon name="more-vert" size={24} color="#000" />
                                    </MenuTrigger>
                                    <MenuOptions>
                                        <MenuOption onSelect={() => handleUpdateGroup(item.group.id, item.group.name, item.group.description)}>
                                            <Text style={styles.menuOptionText}>Update Group</Text>
                                        </MenuOption>
                                        <MenuOption onSelect={() => handleDeleteGroup(item.group.id)}>
                                            <Text style={styles.menuOptionTextDelete}>Delete Group</Text>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                            )}
                        </View>
                    ))}
            </View>
            <View style={styles.actionBtns}>
                <TouchableOpacity style={styles.joinGroupButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.joinGroupButtonText}>Join a Group</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createGroupButton} onPress={() => navigation.navigate('CreateEnterprise')}>
                    <Text style={styles.createGroupButtonText}>Create a Group</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.contactBtn}>
                <Text style={{ fontSize: 16 }}>
                    Do you wish to be part of Realvista Investment Group? Click the button to find out more...
                </Text>
                <TouchableOpacity style={styles.btn} onPress={handleContactPress}>
                    <Text style={[styles.buttonText, { textAlign: 'center' }]}>Contact Us</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Join a Group</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={token}
                            onChangeText={setToken}
                            placeholder="Paste your group token here"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <Text style={styles.modalMessage}>
                            Before you join the group, make sure you read and understand our{' '}
                            <Text style={styles.link} onPress={() => Linking.openURL('https://www.realvistaproperties.com/terms-of-use')}>
                                Terms
                            </Text>{' '}
                            and{' '}
                            <Text style={styles.link} onPress={() => Linking.openURL('https://www.realvistaproperties.com/privacy-policy')}>
                                Policies
                            </Text>.
                        </Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.button, styles.joinButton]}
                                onPress={handleJoinGroup}
                                disabled={loading}
                            >
                                <Text style={styles.buttonText}>{loading ? 'Joining...' : 'Join Group'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default StoryFeature;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    slide: {
        width,
        height: height * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    overlay: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 8
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    groupContainer: {
        padding: 16
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#222',
    },
    groupItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },

    actionBtns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20
    },
    groupName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    groupDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    groupDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    menuOptionText: {
        fontSize: 16,
        padding: 10,
        borderRadius: 5
    },
    menuOptionTextDelete: {
        fontSize: 16,
        padding: 10,
        color: 'red',
    },
    contactBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    btn: {
        backgroundColor: '#FB902E',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    joinGroupButton: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#FB902E',
        backgroundColor: '#FB902E',
        padding: 15,
        margin: 10,
        borderRadius: 5,
    },
    createGroupButton: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#FB902E',
        padding: 15,
        margin: 10,
        borderRadius: 5,
    },
    joinGroupButtonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    createGroupButtonText: {
        textAlign: 'center',
        // color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInput: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    modalMessage: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginVertical: 15,
    },
    link: {
        color: '#358B8B',
        textDecorationLine: 'underline',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginHorizontal: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    joinButton: {
        backgroundColor: '#FB902E',
    },
    cancelButton: {
        backgroundColor: '#adadad',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

