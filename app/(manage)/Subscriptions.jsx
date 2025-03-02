import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Button, Modal } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { formatCurrency } from '@/utils/formatCurrency';
import { useTheme } from '@/context/ThemeContext';
import { useGlobalContext } from "@/context/GlobalProvider";
import SuccessModal from '@/components/Profile/SuccessModal';



const API_URL = "https://www.realvistamanagement.com/subscriptions/plans/";



const Subscriptions = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState([]);
    const [authToken, setAuthToken] = useState(null);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const { reloadProfile } = useGlobalContext();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { colors } = useTheme();

    useEffect(() => {
        const getToken = async () => {
            const token = await AsyncStorage.getItem('authToken');
            setAuthToken(token);
        };
        getToken();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);

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

    useEffect(() => {
        if (authToken) {
            fetchPlans();
        }
    }, [authToken]);


    const handleSelectPlan = (planId) => {
        setSelectedPlan(planId);
    };


    const handleContinue = async () => {
        if (!selectedPlan) {
            console.error("No plan selected!");
            return;
        }

        if (!authToken) {
            console.error("No auth token found!");
            return;
        }

        setIsSubscribing(true);

        try {
            const requestBody = {
                plan_id: selectedPlan, // Ensure it's sent as a string if required
            };

            const response = await axios.post(
                "https://realvistamanagement.com/subscriptions/create-subscription/",
                requestBody,
                {
                    headers: {
                        Authorization: `Token ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            reloadProfile();
            setShowSuccessModal(true);
            // console.log("Subscription created successfully:", response.data);
        } catch (error) {
            if (error.response) {
                console.error("Error creating subscription:", error.response.data); // Log API error details
            } else {
                console.error("Error creating subscription:", error.message);
            }
        } finally {
            setIsSubscribing(false);
        }
    };



    if (loading) {
        return (
            <View style={[styles.centered]}>
                <ActivityIndicator size="large" color="#358B8B" />
                <Text>Loading...</Text>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Choose Your Plan</Text>
                <Text style={styles.subtitle}>Select the subscription that works best for you</Text>
            </View>

            <ScrollView style={styles.plansContainer} showsVerticalScrollIndicator={false}>
                {plans.map((plan) => (
                    <TouchableOpacity
                        key={plan.id}
                        style={[
                            styles.planCard,
                            selectedPlan === plan.id && { borderColor: plan.color, borderWidth: 2 },
                        ]}
                        onPress={() => handleSelectPlan(plan.id)}
                    >
                        {plan.popular && (
                            <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                                <Text style={styles.popularText}>POPULAR</Text>
                            </View>
                        )}

                        <View style={styles.planHeader}>
                            <View style={styles.planInfo}>
                                <Text style={styles.planTitle}>
                                    {plan.name ? plan.name.charAt(0).toUpperCase() + plan.name.slice(1) : ''}
                                </Text>
                                <View style={styles.priceContainer}>
                                    <Text style={styles.planPrice}>{formatCurrency(plan.price, plan.currency)}</Text>
                                    <Text style={styles.planDuration}>{plan.duration}</Text>
                                </View>
                            </View>
                            <Image
                                source={{ uri: plan.image }}
                                style={styles.planImage}
                            />
                        </View>

                        <View style={styles.featuresContainer}>
                            {plan.features.map((feature, index) => (
                                <View key={index} style={styles.featureRow}>
                                    <Text style={[styles.iconText, { color: plan.color, fontFamily: 'YourCustomFont' }]}>✔</Text>
                                    <Text style={styles.featureText}>{feature}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={[styles.selectButton, { backgroundColor: selectedPlan === plan.id ? plan.color : '#f1f5f9' }]}>
                            <Text style={[styles.selectButtonText, { color: selectedPlan === plan.id ? '#ffffff' : '#64748b' }]}>
                                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}

                <SuccessModal
                    visible={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.continueButton, !selectedPlan && styles.continueButtonDisabled]}
                    onPress={handleContinue}
                    disabled={!selectedPlan}
                >
                    <Text style={styles.continueButtonText}>
                        {isSubscribing ? 'Processing...' : 'Continue to Payment'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Subscriptions

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 16,
    },
    header: {
        marginBottom: 20,
        paddingTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
    },
    plansContainer: {
        flex: 1,
    },
    planCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        position: 'relative',
    },
    popularBadge: {
        position: 'absolute',
        top: -10,
        right: 16,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    popularText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    planInfo: {
        flex: 1,
    },
    planTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 4,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    planPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    planDuration: {
        fontSize: 14,
        color: '#64748b',
        marginLeft: 4,
    },
    planImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    featuresContainer: {
        marginBottom: 16,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#334155',
    },
    selectButton: {
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectButtonText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    footer: {
        paddingVertical: 16,
    },
    continueButton: {
        backgroundColor: '#358B8B',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueButtonDisabled: {
        backgroundColor: '#cbd5e1',
    },
    continueButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});