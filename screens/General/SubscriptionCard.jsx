import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { formatCurrency } from '@/utils/formatCurrency';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from "@/context/GlobalProvider";


const SubscriptionCard = ({ user, changePlan }) => {

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancellationReason, setSelectedReason] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const { reloadProfile } = useGlobalContext();
    const [subscriptionStatus, setSubscriptionStatus] = useState('active');

    const cancellationReasons = [
        "Too expensive",
        "Not using it enough",
        "Found a better alternative",
        "Missing features I need",
        "Technical issues",
        "Just taking a break"
    ];

    const handleCancelSubscription = () => {
        setShowCancelModal(true);
    };

    useEffect(() => {
        const getToken = async () => {
            const token = await AsyncStorage.getItem('authToken');
            setAuthToken(token);
        };
        getToken();
    }, []);

    const handleConfirmCancellation = async () => {
        if (!cancellationReason) {
            Alert.alert("Please select a reason", "We'd like to know why you're cancelling.");
            return;
        }

        setIsCancelling(true);

        try {
            const response = await fetch(
                "https://realvistamanagement.com/subscriptions/cancel-subscription/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${authToken}`,
                    },
                    body: JSON.stringify({
                        subscription_code: user.subscription.subscription_code,
                        cancellationReason,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSubscriptionStatus("Cancelled");
                reloadProfile();
                setShowCancelModal(false);
                Alert.alert(
                    "Subscription Cancelled",
                    "Your subscription has been cancelled. You'll have access until the end of your current billing period.",
                    [{ text: "OK" }]
                );
            } else {
                Alert.alert("Cancellation Failed", data.message || "An error occurred while cancelling your subscription.");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to cancel subscription. Please try again later.");
        } finally {
            setIsCancelling(false);
        }
    };

    const handleSelectReason = (reason) => {
        setSelectedReason(reason);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.subscriptionCard}>
                <View style={styles.subscriptionHeader}>
                    <Text style={styles.subscriptionTitle}>Current Subscription</Text>
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: user.subscription.status === 'active' ? '#dcfce7' : '#f1f5f9' }
                    ]}>
                        <Text style={[
                            styles.statusText,
                            { color: user.subscription.status === 'active' ? '#10b981' : '#64748b' }
                        ]}>
                            {user.subscription.status}
                        </Text>
                    </View>
                </View>

                <View style={styles.subscriptionDetails}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Plan</Text>
                        <Text style={styles.detailValue}>{user.subscription.plan ? user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1) : ''}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Price</Text>
                        <Text style={styles.detailValue}>{formatCurrency(user.subscription.price, user.subscription.currency)}</Text>
                    </View>

                    {user.subscription.plan !== 'free' ? (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Next billing</Text>
                            <Text style={styles.detailValue}>{formatDate(user.subscription.next_renewal_date)}</Text>
                        </View>
                    ) : (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Next billing</Text>
                            <Text style={styles.detailValue}>Free Plan - No Billing</Text>
                        </View>
                    )}
                </View>

                <View style={styles.subscriptionActions}>
                    <TouchableOpacity
                        style={styles.changePlanButton}
                        onPress={changePlan}
                    >
                        <Text style={styles.changePlanText}>Change Plan</Text>
                    </TouchableOpacity>
                    {user.subscription.plan !== 'free' ? (
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancelSubscription}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>

            <Modal
                visible={showCancelModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Cancel Subscription</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowCancelModal(false)}
                            >
                                {/* <X size={24} color="#64748b" /> */}
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalSubtitle}>
                            We're sorry to see you go. Please let us know why you're cancelling:
                        </Text>

                        <View style={styles.reasonsContainer}>
                            {cancellationReasons.map((reason, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.reasonButton,
                                        cancellationReason === reason && styles.reasonButtonSelected
                                    ]}
                                    onPress={() => handleSelectReason(reason)}
                                >
                                    <Text
                                        style={[
                                            styles.reasonText,
                                            cancellationReason === reason && styles.reasonTextSelected
                                        ]}
                                    >
                                        {reason}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.keepSubscriptionButton}
                                onPress={() => setShowCancelModal(false)}
                            >
                                <Text style={styles.keepSubscriptionText}>Keep Subscription</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.confirmCancelButton,
                                    !cancellationReason && styles.confirmCancelButtonDisabled
                                ]}
                                onPress={handleConfirmCancellation}
                                disabled={!cancellationReason || isCancelling}
                            >
                                <Text style={styles.confirmCancelText}>
                                    {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.cancellationNote}>
                            Note: You'll continue to have access to your subscription until the end of your current billing period.
                        </Text>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subscriptionCard: {
        margin: 1,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    subscriptionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subscriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    statusBadge: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        color: '#10b981',
        fontWeight: '600',
        fontSize: 12,
    },
    subscriptionDetails: {
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    detailLabel: {
        fontSize: 14,
        color: '#64748b',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
    },
    subscriptionActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    changePlanButton: {
        flex: 1,
        backgroundColor: '#FB902E',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginRight: 8,
    },
    changePlanText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginLeft: 8,
    },
    cancelText: {
        color: '#64748b',
        fontWeight: 'bold',
        fontSize: 14,
    },

    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxWidth: 500,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    closeButton: {
        padding: 4,
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 20,
    },
    reasonsContainer: {
        marginBottom: 24,
    },
    reasonButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        marginBottom: 8,
    },
    reasonButtonSelected: {
        borderColor: '#6366f1',
        backgroundColor: '#eff6ff',
    },
    reasonText: {
        fontSize: 16,
        color: '#334155',
    },
    reasonTextSelected: {
        color: '#6366f1',
        fontWeight: '500',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    keepSubscriptionButton: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginRight: 8,
    },
    keepSubscriptionText: {
        color: '#64748b',
        fontWeight: 'bold',
        fontSize: 14,
    },
    confirmCancelButton: {
        flex: 1,
        backgroundColor: '#ef4444',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginLeft: 8,
    },
    confirmCancelButtonDisabled: {
        backgroundColor: '#fca5a5',
    },
    confirmCancelText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    cancellationNote: {
        fontSize: 14,
        color: '#94a3b8',
        fontStyle: 'italic',
        textAlign: 'center',
    },
});

export default SubscriptionCard;
