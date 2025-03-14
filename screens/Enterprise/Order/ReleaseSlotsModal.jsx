import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useFetchMembersDeviceTokens from "@/hooks/useFetchMembersDeviceTokens";
import { sendNotification } from '@/utils/sendNotifications';
import { useGlobalContext } from '@/context/GlobalProvider';
import axios from 'axios';

const ReleaseSlotsModal = (
    {
        visible,
        onClose,
        onRefresh,
        totalUserSlots,
        property,
        groupId,
        uniqueGroupId
    }) => {
    const { user } = useGlobalContext();
    const [slots, setSlots] = useState("");
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [userReleasedSlots, setUserReleasedSlots] = useState("")

    const { membersTokens } = useFetchMembersDeviceTokens(uniqueGroupId);


    useEffect(() => {
        const validateForm = () => {
            let error = "";
            const slotsParsed = parseInt(slots, 10);
            const maxReleasableSlots = totalUserSlots - userReleasedSlots; // Compute available slots to release

            if (isNaN(slotsParsed) || slotsParsed <= 0) {
                error = "Please enter a valid number of slots greater than 0.";
            } else if (maxReleasableSlots <= 0) {
                error = "You have no available slots to release.";
            } else if (slotsParsed > maxReleasableSlots) {
                error = `You cannot release more than ${maxReleasableSlots} slots.`;
            }

            setErrorMessage(error);
            setIsValid(!error);
        };

        validateForm();
    }, [slots, totalUserSlots, userReleasedSlots]);


    const title = "Slots Released";
    const deviceTokens = membersTokens;

    const fetchUserReleasedSlots = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await axios.get(`https://realvistamanagement.com/enterprise/get-slots-total/?property=${property.id}`, {
                headers: {
                    Authorization: `Token ${token}`,
                }
            });
            const userSlots = response.data.total_released_slots;
            setUserReleasedSlots(userSlots);
        } catch (error) {
            console.error("Fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserReleasedSlots();
    }, []);

    const handleTransfer = async () => {
        if (!isValid) return;

        const messageData = {
            sender: user.name,
            text: `released ${parseInt(slots)} slot(s) from the property ${property.title}! Group: ${property.group_owner_name}`,
            senderEmail: user.email,
        };

        setLoading(true);
        setErrorMessage("");
        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch("https://realvistamanagement.com/enterprise/release-slot/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    property: property.id,
                    group: groupId,
                    number_of_slots: parseInt(slots, 10),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", data.message || "Slots released successfully.");
                onRefresh();
                onClose();
                setSlots("");
            } else {
                Alert.alert("Error", data.message || "Failed to release slots.");
            }

            if (deviceTokens) {
                try {
                    await sendNotification({ title, messageData, deviceTokens });
                } catch (notificationError) {
                    console.error('Notification Error:', notificationError);
                    Alert.alert('Notification Failed', 'Booking succeeded, but notification failed to send.');
                }
            } else {
                console.warn('No device tokens available for notification.');
            }
        } catch (error) {
            console.error("Release failed:", error);
            Alert.alert("Error", "Failed to release slots due to a network error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Release Slots</Text>
                    <View style={styles.availableSlotsContainer}>
                        <Text style={styles.availableSlotsText}>Your available slots: {totalUserSlots}</Text>
                        <Text style={styles.availableSlotsText}>Released Slots: {userReleasedSlots}</Text>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Number of Slots"
                        keyboardType="numeric"
                        value={slots}
                        onChangeText={setSlots}
                    />

                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                    {loading ? (
                        <ActivityIndicator size="large" color="#358B8B" />
                    ) : (
                        <TouchableOpacity
                            style={[styles.button, !isValid && styles.disabledButton]}
                            onPress={handleTransfer}
                            disabled={!isValid}
                        >
                            <Text style={styles.buttonText}>Release</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    availableSlotsContainer: {
        width: "100%",
        marginBottom: 15,
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        alignItems: "center",
    },
    availableSlotsText: {
        fontSize: 16,
        color: "#333",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#FB902E",
        padding: 12,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    cancelButton: {
        marginTop: 10,
        padding: 10,
    },
    cancelText: {
        color: "#FB902E",
        fontSize: 16,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        textAlign: "left",
    },
});

export default ReleaseSlotsModal;