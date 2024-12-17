import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { io } from "socket.io-client";

const ChatRoom = ({ userId }) => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [isConnected, setIsConnected] = useState(false); // Track connection status
    const [loading, setLoading] = useState(true); // Show loading indicator while connecting

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io("http://localhost:3000", {
            transports: ["websocket"], // Ensure WebSocket transport is used
            path: "/socket.io", // Use the correct socket.io path
        });

        setSocket(newSocket);

        // Handle socket events
        newSocket.on("connect", () => {
            console.log("Connected to WebSocket server");
            setIsConnected(true);
            setLoading(false);
            newSocket.emit("join", { userId });
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from WebSocket server");
            setIsConnected(false);
        });

        newSocket.on("receive_message", (data) => {
            setChat((prevChat) => [...prevChat, data]);
        });

        newSocket.on("error", (error) => {
            console.error("WebSocket error:", error);
        });

        newSocket.on("connect_error", (error) => {
            console.error("Connection error:", error);
            setIsConnected(false);
            setLoading(false);
        });

        // Cleanup on component unmount
        return () => {
            newSocket.disconnect();
        };
    }, [userId]);

    const sendMessage = () => {
        if (socket && message.trim()) {
            const recipientId = "recipient-id"; // Replace with actual recipient logic
            const newMessage = {
                senderId: userId,
                recipientId,
                message,
            };

            socket.emit("send_message", newMessage);
            setChat((prevChat) => [...prevChat, newMessage]); // Add sent message to local chat
            setMessage("");
        }
    };

    // Show a loading spinner while connecting
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Connecting to chat server...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chat Room</Text>
            <Text style={isConnected ? styles.status : styles.statusError}>
                {isConnected ? "Connected to server" : "Disconnected from server"}
            </Text>
            <FlatList
                data={chat}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.message}>
                        <Text style={styles.sender}>{item.senderId}: </Text>
                        <Text style={styles.text}>{item.message}</Text>
                    </View>
                )}
            />
            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message..."
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    status: {
        color: "green",
        textAlign: "center",
        marginBottom: 10,
    },
    statusError: {
        color: "red",
        textAlign: "center",
        marginBottom: 10,
    },
    message: {
        flexDirection: "row",
        marginBottom: 5,
        padding: 5,
        backgroundColor: "#e1e1e1",
        borderRadius: 5,
    },
    sender: {
        fontWeight: "bold",
    },
    text: {
        flex: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default ChatRoom;
