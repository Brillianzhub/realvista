import { StyleSheet, Text, View, Image, ScrollView, Alert } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';
import images from '../../constants/images'
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import TransactionDetail from '../../components/TransactionDetail';
import useUserOrders from "../../hooks/useUserOrders";
import useUserHoldings from "../../hooks/useUserHoldings";
import useUserDividends from '../../hooks/useUserDividends';

import BottomSheet from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';


const profile = () => {
    const { user, setIsLogged, setUser, } = useGlobalContext();
    const [selectedItem, setSelectedItem] = useState(null);
    const bottomSheetRef = useRef(null);

    const [totalInvestedAmount, setTotalInvestedAmount] = useState(0);

    const { orders, fetchUserOrders } = useUserOrders();
    const { holdings, fetchUserHoldings } = useUserHoldings();
    const { dividends, fetchDividends } = useUserDividends();

    console.log(user)

    useEffect(() => {
        const sum = holdings.reduce((acc, item) => acc + parseFloat(item.amount), 0);

        const totalFinalShareAmount = dividends.reduce((total, dividend) => {
            const sharesSum = dividend.shares.reduce(
                (shareTotal, share) => shareTotal + parseFloat(share.final_share_amount),
                0
            );
            return total + sharesSum;
        }, 0);

        setTotalInvestedAmount(sum + totalFinalShareAmount);

    }, [holdings, dividends]);


    const signOut = async () => {
        try {
            const response = await axios.post(
                'https://www.realvistamanagement.com/accounts/logout/'
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
            await AsyncStorage.removeItem('authToken');
            setUser(null);
            setIsLogged(false);
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return formattedDate;
    };

    const sortedOrders = orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));


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
                        <Text style={styles.portfolioItemText}>0.00 USD</Text>
                    </View>
                    <View style={styles.portfolioItem}>
                        <Text style={styles.portfolioItemText}>Investment Account</Text>
                        <Text style={styles.portfolioItemText}>{totalInvestedAmount} USD</Text>
                    </View>
                    <View style={styles.portfolioItem}>
                        <Text style={styles.portfolioItemText}>Total</Text>
                        <Text style={styles.portfolioItemText}>{totalInvestedAmount} USD</Text>
                    </View>
                </View>
                <View style={styles.portfolioSummary}>
                    <View style={styles.portfolioNet}>
                        <Text style={styles.portfolioNetText}>Transactions</Text>
                    </View>

                    {sortedOrders.slice(0, 3).map((transaction) => (
                        <View style={styles.portfolioItem} key={transaction.id}>
                            <View style={styles.notificationsViewItem}>
                                <View style={styles.notificationsPoint}></View>
                                <View>
                                    <Text style={styles.portfolioItemText}>{transaction.project.name}</Text>
                                    <Text style={styles.notificationsDate}>{formatDate(transaction.created_at)}</Text>
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

                    <View style={{ marginVertical: 10, paddingLeft: 10 }}>
                        <TouchableOpacity
                            onPress={() => router.replace('/transactions')}
                        >
                            <Text style={{ fontWeight: '600', color: '#358B8B', fontSize: 16 }}>View all</Text>
                        </TouchableOpacity>
                    </View>
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

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={['50%', '100%']}
                enablePanDownToClose={true}
                onClose={closeBottomSheet}
                enableContentPanningGesture={true}
                handleStyle={styles.handleContainer}
                handleIndicatorStyle={styles.handleIndicator}
            >
                <TransactionDetail
                    selectedItem={selectedItem}
                    closeBottomSheet={closeBottomSheet}
                    refreshData={fetchUserOrders}
                />
            </BottomSheet>

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
    },
    handleContainer: {
        backgroundColor: '#358B8B1A',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    handleIndicator: {
        backgroundColor: '#136e8b',
        width: 50,
        height: 5,
        borderRadius: 3,
    },

})
