import React, { useState, useEffect, useCallback } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useFetchUserDevice from "@/hooks/useFetchUserDevice";
import { sendNotification } from '@/utils/sendNotifications';
import { useGlobalContext } from '@/context/GlobalProvider';
import { debounce } from "lodash";

const TransferSlotsModal = (
    {
        visible,
        allocationIds,
        onClose,
        onRefresh,
        totalUserSlots,
        members,
    }) => {
    const { user } = useGlobalContext();
    const [email, setEmail] = useState("");
    const [slots, setSlots] = useState("");
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [debouncedEmail, setDebouncedEmail] = useState("");

    const debounceEmail = useCallback(
        debounce((value) => {
            setDebouncedEmail(value);
        }, 500),
        []
    );

    useEffect(() => {
        debounceEmail(email.trim());
    }, [email, debounceEmail]);

    const { device, loading: deviceLoading } = useFetchUserDevice(debouncedEmail);


    useEffect(() => {
        const validateForm = () => {
            let error = "";
            const emailTrimmed = email.trim();
            const slotsParsed = parseInt(slots, 10);

            if (!emailTrimmed) {
                error = "Recipient email is required.";
            } else if (!members.includes(emailTrimmed)) {
                error = "Recipient email not found among group members.";
            } else if (isNaN(slotsParsed) || slotsParsed <= 0) {
                error = "Please enter a valid number of slots greater than 0.";
            } else if (slotsParsed > totalUserSlots) {
                error = `You cannot transfer more than ${totalUserSlots} slots.`;
            }

            setErrorMessage(error);
            setIsValid(!error);
        };

        validateForm();
    }, [debouncedEmail, slots, members, totalUserSlots]);


    const title = "Slots Received";
    const deviceTokens = device?.token;

    const handleTransfer = async () => {
        if (!isValid) return;

        const messageData = {
            sender: user.name,
            text: `transferred ${parseInt(slots)} slots to you!.`,
            senderEmail: user.email,
        };

        setLoading(true);
        setErrorMessage("");
        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch("https://realvistamanagement.com/enterprise/transfer-slots/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    allocation_id: allocationIds.join(","),
                    target_user_email: email.trim(),
                    slots_to_transfer: parseInt(slots, 10),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", data.message || "Slots transferred successfully.");
                onRefresh();
                onClose();
                setEmail("");
                setSlots("");
            } else {
                Alert.alert("Error", data.message || "Failed to transfer slots.");
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
            console.error("Transfer failed:", error);
            Alert.alert("Error", "Failed to transfer slots due to a network error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Transfer Slots</Text>
                    <View style={styles.availableSlotsContainer}>
                        <Text style={styles.availableSlotsText}>Your available slots: {totalUserSlots}</Text>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Recipient Email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />

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
                            <Text style={styles.buttonText}>Transfer</Text>
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

export default TransferSlotsModal;