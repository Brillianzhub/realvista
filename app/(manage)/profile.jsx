import { StyleSheet, Text, View, Image, ScrollView, Alert } from 'react-native';
import React, { useState, useRef } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';
import images from '../../constants/images'
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import TransactionDetail from '../../components/TransactionDetail';
import { useInvestmentData } from '../../context/InvestmentProvider';

const profile = () => {
    const { user, setIsLogged, setUser, } = useGlobalContext();
    const [selectedItem, setSelectedItem] = useState(null);
    const bottomSheetRef = useRef(null);
    const { investment } = useInvestmentData();

    console.log(investment)

    const signOut = async () => {
        try {
            const response = await axios.post(
                'https://brillianzhub.eu.pythonanywhere.com/accounts/logout/'
            );
            if (response.status === 200) {
                console.log("Logged out successfully");
                return true;
            } else {
                console.error("Failed to log out");
                return false;
            }
        } catch (error) {
            console.error("Logout Error: ", error);
            Alert.alert('Logout Error', 'Failed to logout. Please try again.');
            return false;
        }
    };

    const logout = async () => {
        try {
            if (user?.auth_provider === 'email') {
                const success = await signOut();
                if (!success) return;
            }
            setUser(null); // Clear user
            setIsLogged(false); // Update login status
            router.replace('/sign-in')
        } catch (error) {
            console.error('Logout Error', error);
        }
    };

    const initialName = user?.name ? user.name.charAt(0) : '';

    const openTransactionDetails = (item) => {
        setSelectedItem(item);
        bottomSheetRef.current?.expand();
    };

    const closeBottomSheet = () => {
        bottomSheetRef.current?.close();
        setSelectedItem(null);
    };

    const transactions = [
        { id: 1, title: 'Created an order', date: '03/04/25', amount: 200, description: 'Grocery Shopping' },
        { id: 2, title: 'Completed payment', date: '04/04/25', amount: 500, description: 'Utility Payment' },
        { id: 3, title: 'Personal Account', date: '05/04/25', amount: 1000, description: 'Rent Payment' },
    ];

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.userInitialNameView}>
                    <Text style={styles.userInitialName}>{initialName}</Text>
                </View>
                <View style={styles.userNameView}>
                    <Text style={styles.userName}>{user?.name}</Text>
                </View>
                <View style={styles.portfolioSummary}>
                    <View style={styles.portfolioNet}>
                        <Text style={styles.portfolioNetText}>Net Worth</Text>
                    </View>
                    <View style={styles.portfolioItem}>
                        <Text style={styles.portfolioItemText}>Personal Account</Text>
                        <Text style={styles.portfolioItemText}>500,000.00 EUR</Text>
                    </View>
                    <View style={styles.portfolioItem}>
                        <Text style={styles.portfolioItemText}>Investment Account</Text>
                        <Text style={styles.portfolioItemText}>300,000.00 EUR</Text>
                    </View>
                    <View style={styles.portfolioItem}>
                        <Text style={styles.portfolioItemText}>Total</Text>
                        <Text style={styles.portfolioItemText}>800,000.00 EUR</Text>
                    </View>
                </View>
                <View style={styles.portfolioSummary}>
                    <View style={styles.portfolioNet}>
                        <Text style={styles.portfolioNetText}>Transactions</Text>
                    </View>

                    {transactions.map((transaction) => (
                        <View style={styles.portfolioItem} key={transaction.id}>
                            <View style={styles.notificationsViewItem}>
                                <View style={styles.notificationsPoint}></View>
                                <View>
                                    <Text style={styles.portfolioItemText}>{transaction.title}</Text>
                                    <Text style={styles.notificationsDate}>{transaction.date}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => openTransactionDetails(transaction)}>
                                <Image
                                    source={images.goTo}
                                    style={{ height: 30, width: 30 }}
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
                <View style={styles.portfolioSummary}>
                    <View style={styles.portfolioNet}>
                        <Text style={styles.portfolioNetText}>Profile</Text>
                    </View>
                    <View style={styles.portfolioItem}>
                        <Text style={styles.portfolioItemText}>Edit account</Text>
                    </View>
                    <View style={styles.portfolioItem}>
                        <Text style={styles.portfolioItemText}>Change password</Text>
                    </View>
                </View>
                <View style={styles.portfolioSummary}>
                    <TouchableOpacity
                        onPress={logout}
                    >
                        <Image
                            source={images.logout}
                            style={{ height: 30, width: 30, marginTop: 20 }}
                        />
                    </TouchableOpacity>
                </View>

            </View>
            <TransactionDetail
                selectedItem={selectedItem}
                bottomSheetRef={bottomSheetRef}
                closeBottomSheet={closeBottomSheet}
            />
        </ScrollView>
    )
}

export default profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    userInitialNameView: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#358B8B',
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    userInitialName: {
        color: 'white',
        fontSize: 25,
        fontWeight: '600'
    },
    userNameView: {
        marginVertical: 20,

    },
    userName: {
        fontSize: 30,
        fontWeight: '600',
        textAlign: 'center'
    },
    portfolioSummary: {
        paddingBottom: 10,
    },
    portfolioNet: {
        marginTop: 30,
    },
    portfolioNetText: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    portfolioItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    portfolioItemText: {
        fontSize: 16,
        fontWeight: '600',

    },
    notificationsViewItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10
    },
    notificationsPoint: {
        height: 8,
        width: 8,
        borderRadius: 50,
        backgroundColor: '#358B8B'
    },
    notificationsDate: {
        color: 'gray'
    }

})
