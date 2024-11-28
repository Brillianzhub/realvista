import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import images from '../constants/images';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';



const OrderCreatedScreen = ({ route }) => {
    const { orderData } = route.params;
    if (!orderData) return <Text>No Order Data</Text>

    const {
        order_reference,
        order_details: {
            quantity,
            total_amount,
            payment_status,
            created_at,
            project_name,
        },
    } = orderData;

    const navigation = useNavigation();


    const handleBackToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Investment' }],
            })
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={images.orderCreated}
                    style={styles.imageStyle}
                />
                <Text style={styles.title}>Order Created Successfully!</Text>
                <Text style={styles.amount}>${total_amount}</Text>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.text}>Order Reference: {order_reference}</Text>
                <Text style={styles.text}>Project Name: {project_name}</Text>
                <Text style={styles.text}>Quantity: {quantity}</Text>
                <Text style={styles.text}>Total Amount: ${total_amount.toFixed(2)}</Text>
                <Text style={styles.text}>Payment Status: {payment_status}</Text>
                <Text style={styles.text}>Created At: {new Date(created_at).toLocaleString()}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.downloadButton}>
                    <Image
                        source={images.download}
                        style={styles.imageDownload}
                    />
                    <Text style={styles.downloadButtonText}>Download Invoice as PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleBackToHome}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

export default OrderCreatedScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    imageContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
    amount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FB902E',
        marginTop: 5,
        textAlign: 'center',
    },
    detailsContainer: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    text: {
        fontSize: 16,
        color: '#333',
        marginVertical: 5,
    },
    buttonsContainer: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginBottom: 10,
        width: '100%',
        backgroundColor: '#FB902E',
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 16,
        color: '#ffffff',
        marginLeft: 8,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginBottom: 10,
        width: '100%',
        backgroundColor: '#DEDEDE',
        borderRadius: 8,
    },
    downloadButtonText: {
        fontSize: 16,
        color: '#ffffff',
        marginLeft: 8,
    },
    imageStyle: {
        height: 56,
        width: 56
    },
    imageDownload: {
        height: 24,
        width: 24
    }
});
