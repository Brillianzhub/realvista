import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { io } from 'socket.io-client';
import { useGlobalContext } from '../../context/GlobalProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useChatMessages from '../../hooks/useChatMessages';
import { Audio } from 'expo-av';



// const socket = io('http://192.168.0.57:9000');
const socket = io('https://www.realvistaproperties.com');


const Chat = ({ route }) => {
    const { uniqueGroupId } = route.params;
    const { messages, setMessages, fetchMessages } = useChatMessages({ uniqueGroupId });
    const [replyTo, setReplyTo] = useState(null);
    const [input, setInput] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const { user } = useGlobalContext();
    const [userToken, setUserToken] = useState(null);


    const soundFiles = {
        'custom-sound.mp3': require('../../assets/sounds/custom-sound.mp3'),
    };

    const playNotificationSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/sounds/custom-sound.mp3')
            );
            await sound.playAsync();
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.error('Error playing notification sound:', error);
        }
    };


    useEffect(() => {
        socket.on('receive_message', async (messageData) => {
            setMessages((prev) => [...prev, messageData]);

            if (messageData.sound) {
                await playNotificationSound();
            }
        });

        socket.on('delete_message', (messageId) => {
            setMessages((prev) => prev.filter((msg) => msg.message_id !== messageId));
        });

        socket.on('receive_reply', (replyData) => {
            setMessages((prev) => {
                const updatedMessages = [...prev];
                const messageIndex = updatedMessages.findIndex((msg) => msg.message_id === replyData.replyTo.message_id);
                if (messageIndex !== -1) {
                    updatedMessages.splice(messageIndex + 1, 0, replyData);
                }
                return updatedMessages;
            });
        });

        return () => {
            socket.off('receive_message');
            socket.off('delete_message');
            socket.off('receive_reply');
        };
    }, []);

    const playFeedbackSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/sounds/custom-sound.mp3')
            );
            await sound.playAsync();
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.error('Error playing feedback sound:', error);
        }
    };



    useEffect(() => {
        const retrieveUserToken = async () => {
            const token = await AsyncStorage.getItem('authToken');
            setUserToken(token);
        };
        retrieveUserToken();
    }, [])

    const sendMessage = async () => {
        if (input.trim() === '') return;

        const timestamp = new Date().toISOString();
        const message = {
            text: input,
            sender: user.name,
            groupID: uniqueGroupId,
            userToken: userToken,
            timestamp,
            message_id: Date.now().toString(),
            replyTo: replyTo ? { message_id: replyTo.message_id, text: replyTo.text, sender: replyTo.sender } : null,
        };
        socket.emit('send_message', message);
        setMessages((prev) => [...prev, message]);
        setInput('');
        setReplyTo(null);

        // Play feedback sound
        await playFeedbackSound();
    };

    const handleReply = (message) => {
        setReplyTo(message);
        setSelectedMessage(null);
    };

    const handleDelete = (messageId) => {
        setMessages((prev) => prev.filter((msg) => msg.message_id !== messageId));
        socket.emit('delete_message', { message_id: messageId });
        setSelectedMessage(null);
    };

    const formatTime = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDateHeader = (isoDate) => {
        const date = new Date(isoDate);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };


    const renderMessage = ({ item, index }) => {
        const senderInitial = item.sender.charAt(0).toUpperCase();
        const showDateHeader =
            index === 0 ||
            new Date(messages[index].timestamp).toDateString() !==
            new Date(messages[index - 1]?.timestamp).toDateString();

        return (
            <>
                {showDateHeader && (
                    <Text style={styles.dateHeader}>
                        {formatDateHeader(item.timestamp)}
                    </Text>
                )}
                <View style={styles.messageContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{senderInitial}</Text>
                    </View>
                    <View style={styles.messageContent}>
                        <Text style={styles.senderName}>{item.sender}</Text>
                        <Text style={styles.messageText}>{item.text}</Text>
                        <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>

                        {item.replyTo && (
                            <View style={styles.replyContainer}>
                                <Text style={styles.replyText}>
                                    Replying to {item.replyTo.sender}: {item.replyTo.text}
                                </Text>
                            </View>
                        )}

                        {selectedMessage && selectedMessage.message_id === item.message_id && (
                            <View style={styles.toolbar}>
                                <TouchableOpacity onPress={() => handleReply(item)} style={styles.toolbarButton}>
                                    <Icon name="reply" size={20} color="#358B8B" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item.message_id)} style={styles.toolbarButton}>
                                    <Icon name="trash" size={20} color="#d32f2f" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </>
        );
    };

    const handleLongPress = (message) => {
        if (selectedMessage && selectedMessage.message_id === message.message_id) {
            setSelectedMessage(null);
        } else {
            setSelectedMessage(message);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
            {replyTo && (
                <View style={styles.replyBox}>
                    <Text style={styles.replyText}>
                        Replying to {replyTo.sender}: {replyTo.text}
                    </Text>
                    <TouchableOpacity onPress={() => setReplyTo(null)} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={messages}
                keyExtractor={(item) => item.message_id}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onLongPress={() => handleLongPress(item)}
                    >
                        {renderMessage({ item, index })}
                    </TouchableOpacity>
                )}
                style={{ flex: 1, marginBottom: 10 }}
                showsVerticalScrollIndicator={false}
            />
            <TextInput
                placeholder="Type a message..."
                value={input}
                onChangeText={setInput}
                multiline={true}
                textAlignVertical="center"
                style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: 10,
                    alignItems: 'center',
                    maxHeight: 120,
                }}
                onSubmitEditing={(event) => {
                    setInput((prev) => `${prev}\n`);
                }}
                blurOnSubmit={false}
            />

            <TouchableOpacity
                onPress={sendMessage}
                style={styles.sendBtn}
            >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                    Send
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    dateHeader: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginVertical: 10,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#358B8B',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    messageContent: {
        flex: 1,
        backgroundColor: 'rgba(53, 139, 139, 0.15)',
        padding: 10,
        borderRadius: 10,
    },
    senderName: {
        fontWeight: 'bold',
        marginBottom: 2,
    },
    messageText: {
        marginBottom: 2,
    },
    timestamp: {
        fontSize: 10,
        color: '#aaa',
        textAlign: 'right',
    },
    replyContainer: {
        marginTop: 5,
        marginLeft: 20,
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5,
    },
    replyText: {
        fontSize: 12,
        color: '#555',
        fontStyle: 'italic',
    },
    replyBox: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderLeftWidth: 4,
        borderLeftColor: '#007bff',
        marginBottom: 10,
    },
    cancelButton: {
        marginTop: 5,
        alignItems: 'flex-end',
    },
    cancelButtonText: {
        color: '#007bff',
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginTop: 5,
    },
    toolbarButton: {
        padding: 5,
    },
    sendBtn: {
        backgroundColor: '#FB902E',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center'
    }
});

export default Chat;
