import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import images from '../constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalProvider';
import { useNavigation } from '@react-navigation/native';
import { useInvestmentData } from '@/context/InvestmentProvider';


const InvestmentScreen = ({ route }) => {
    const { user } = useGlobalContext();
    const { projectId } = route.params;
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [totalAmount, setTotalAmount] = useState(0);
    const navigation = useNavigation();

    const { setInvestment } = useInvestmentData();

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(totalAmount);


    useEffect(() => {
        const fetchProjectDetail = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');

                if (!token) {
                    console.error("No authentication token found");
                    return;
                }
                const response = await axios.get(`https://brillianzhub.eu.pythonanywhere.com/projects/${projectId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setProject(response.data);
            } catch (error) {
                console.error("Unable to fetch project details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetail();
    }, [projectId]);


    const incrementQuantity = () => {
        setQuantity(prevQuantity => {
            if (prevQuantity + 1 > project.available_slots) {
                Alert.alert('The quantity you entered exceeds the available number of slots')
                return prevQuantity;
            }
            return prevQuantity + 1;
        });
    };

    const decrementQuantity = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1))
    };

    useEffect(() => {
        if (project?.cost_per_slot) {
            setTotalAmount(quantity * project.cost_per_slot);
        }
    }, [quantity, project]);


    let formattedCost = '';
    if (project && project.cost_per_slot) {
        formattedCost = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(project.cost_per_slot);
    } else {
        formattedCost = 'N/A';
    };


    const handleProceedToPayment = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert('Error', 'User authentication token not found');
                setLoading(false);
                return;
            }
            const payload = {
                user_id: user.id,
                user_email: user.email,
                user_name: user.name,
                project_id: project.id,
                project_name: project.name,
                quantity: quantity,
                cost_per_slot: project.cost_per_slot,
                total_amount: project.cost_per_slot * quantity,
            };

            const response = await axios.post(
                'https://brillianzhub.eu.pythonanywhere.com/order/send-email/',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setInvestment(response.data)

                navigation.navigate('OrderCreatedScreen', { orderData: response.data });
            } else {
                Alert.alert('Error', 'Failed to send invoice email.');
            }
        } catch (error) {
            console.error('Error sending invoice email:', error);
            Alert.alert('Error', 'Something went wrong while sending the invoice.');
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <Text>Loading...</Text>;
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    };

    if (!project) {
        return <Text>Project not found</Text>;
    };

    return (
        <View style={styles.container}>
            <View style={styles.orderPreview}>
                {project.images && project.images.length > 0 ? (
                    <View>
                        <Image
                            source={{ uri: project.images[0].image_url }}
                            style={styles.projectImage}
                        />
                    </View>
                ) : (
                    <Text>No images available</Text>
                )}
                <View style={styles.orderSummary}>
                    <Text style={styles.orderSummaryTitle}>Order Summary</Text>
                    <Text style={styles.orderSummaryInfo}>Total No. of Slots: {project.num_slots}</Text>
                    <Text style={styles.orderSummaryInfo}>Cost/Slot: {formattedCost}</Text>
                    <View style={styles.orderQuantity}>
                        <Text style={styles.orderSummaryInfo}> Qty</Text>
                        <TouchableOpacity
                            onPress={decrementQuantity}
                        >
                            <Image
                                source={images.decrement}
                                style={styles.changeIcon}
                            />
                        </TouchableOpacity>
                        <Text style={styles.quantityValue}>{quantity}</Text>
                        <TouchableOpacity
                            onPress={incrementQuantity}
                        >
                            <Image
                                source={images.increment}
                                style={styles.changeIcon}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.orderSummaryAmount}>Total amount: {formattedAmount}</Text>
                </View>
            </View>
            <View style={styles.paymentContainer}>
                <View style={styles.paymentHeader}>
                    <Text style={styles.paymentTitle}>Payment Option</Text>
                </View>
                <View style={styles.paymentDetails}>
                    <Text style={styles.paymentMethod}>Bank Transfer</Text>
                    <Text style={styles.paymentInstruction}>
                        Transfer {formattedAmount} to the following Bank account.
                    </Text>
                    <Text style={styles.bankDetails}>Bank Name: Commerzbank</Text>
                    <Text style={styles.bankDetails}>Account Name: Realvista GmbH</Text>
                    <Text style={styles.bankDetails}>IBAN: DE06 ...........</Text>
                    <Text style={styles.paymentNote}>
                        N/B: Payment through Bank transfers will take up to 2 working days to verify!
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.proceedButton}
                    onPress={handleProceedToPayment}
                    disabled={loading}
                >
                    <Text style={styles.proceedButtonText}>
                        {loading ? 'Processing...' : 'Proceed to Create Order'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default InvestmentScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    orderPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 15,
    },
    projectImage: {
        width: 120,
        height: 180,
        borderRadius: 8,
        marginRight: 15,
    },
    orderSummary: {
        marginBottom: 10
    },
    orderQuantity: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'flex-start',
        gap: 10
    },
    changeIcon: {
        width: 40,
        height: 40,
        marginHorizontal: 10,
    },
    orderSummaryTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        color: '#358B8B'
    },
    orderSummaryInfo: {
        fontSize: 16,
        marginBottom: 8
    },
    orderSummaryAmount: {
        fontSize: 18,
        marginTop: 10,
        fontWeight: '600',
        color: '#FB902E'
    },
    quantityValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },

    paymentContainer: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginVertical: 15,
    },
    paymentHeader: {
        marginBottom: 15,
    },
    paymentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    paymentDetails: {
        marginBottom: 20,
    },
    paymentMethod: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    paymentInstruction: {
        fontSize: 14,
        marginBottom: 10,
        color: '#555',
    },
    bankDetails: {
        fontSize: 14,
        marginBottom: 5,
        color: '#333',
    },
    paymentNote: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#666',
        marginTop: 10,
    },
    proceedButton: {
        backgroundColor: '#FB902E',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    proceedButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
