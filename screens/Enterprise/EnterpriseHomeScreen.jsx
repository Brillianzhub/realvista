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

            const response = await fetch('https://www.realvistamanagement.com/enterprise/group/join/', {
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

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
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
                {groups?.length > 0 ? (
                    groups.map((item) => (
                        <TouchableOpacity
                            key={item.group.id}
                            style={styles.groupItem}
                            onPress={() =>
                                navigation.navigate('GroupDashboard', {
                                    groupId: item.group.id,
                                    uniqueGroupId: item.group.group_id,
                                    role: item.role,
                                })
                            }
                        >
                            <Text style={styles.groupName}>{item.group.name}</Text>
                            <Text style={styles.groupDescription}>{item.group.description}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.noGroupContainer}>
                        <Text style={styles.noGroupText}>
                            You don't belong to any groups yet. Explore group investment plans and
                            learn how you can start your journey toward shared success.
                        </Text>
                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={() => navigation.navigate('Contact')}
                        >
                            <Text style={styles.contactButtonText}>Contact Us to Learn More</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.createGroupButton}
                            onPress={() => navigation.navigate('CreateEnterprise')}
                        >
                            <Text style={styles.createGroupButtonText}>Create a Group</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Join Group Button */}
            <TouchableOpacity style={styles.joinGroupButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.joinGroupButtonText}>Join a Group</Text>
            </TouchableOpacity>

            {/* Join Group Modal */}
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
    actionButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 20,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },

    groupName: {
        fontSize: 16,
        color: '#333',
    },
    groupDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    noGroupContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    noGroupText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    contactButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    createGroupButton: {
        backgroundColor: '#FB902E',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    createGroupButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    joinGroupButton: {
        backgroundColor: '#FB902E',
        padding: 15,
        margin: 20,
        borderRadius: 5,
    },
    joinGroupButtonText: {
        textAlign: 'center',
        color: 'white',
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

