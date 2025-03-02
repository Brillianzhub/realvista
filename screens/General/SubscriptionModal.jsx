import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://www.realvistamanagement.com/subscriptions/plans/";

const SubscriptionModal = ({ visible, onClose }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authToken, setAuthToken] = useState(null);

    useEffect(() => {
        const getToken = async () => {
            const token = await AsyncStorage.getItem('authToken');
            setAuthToken(token);
        };
        getToken();
    }, []);

    useEffect(() => {
        if (visible) {
            fetchPlans();
        }
    }, [visible]);

    const fetchPlans = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                },
            });
            setPlans(response.data);
        } catch (error) {
            console.error("Error fetching subscription plans:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Choose a Subscription Plan</Text>

                    {loading ? (
                        <ActivityIndicator size="large" color="#358B8B" />
                    ) : (
                        <FlatList
                            data={plans}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.planCard}
                                    onPress={() => Alert.alert("Selected Plan", item.name)}
                                >
                                    <Text style={styles.planName}>{item.name.toUpperCase()}</Text>
                                    <Text style={styles.planPrice}>
                                        {item.currency} {item.price}
                                    </Text>
                                    <Text style={styles.planDuration}>{item.duration}</Text>
                                    <Text style={styles.planFeatures}>{item.features}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default SubscriptionModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        maxHeight: "80%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    planCard: {
        backgroundColor: "#f5f5f5",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    planName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    planPrice: {
        fontSize: 16,
        color: "#666",
        marginTop: 5,
    },
    planDuration: {
        fontSize: 14,
        color: "#999",
        marginTop: 5,
    },
    planFeatures: {
        fontSize: 14,
        color: "#555",
        marginTop: 5,
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#358B8B",
        borderRadius: 5,
        alignItems: "center",
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
