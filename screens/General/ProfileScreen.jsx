import {
    StyleSheet, Text, View, Image, ScrollView, Alert, Linking, Share,
    Button, Platform, ActivityIndicator, Dimensions
} from 'react-native';
import React, { useState, useRef } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';
import images from '../../constants/images';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import TransactionDetail from '../../components/TransactionDetail';
import useUserOrders from "../../hooks/useUserOrders";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatCurrency } from '../../utils/formatCurrency';
import usePortfolioDetail from '../../hooks/usePortfolioDetail';
import { useTheme } from '@/context/ThemeContext';
import DeleteAccountModal from './DeleteAccountModal';
import SubmitReferralModal from './SubmitReferralModal';
import WithdrawModal from './WithdrawModal';
import SubscriptionModal from './SubscriptionModal';
import * as Clipboard from 'expo-clipboard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SubscriptionCard from './SubscriptionCard';

const Profile = () => {
    const { user, setIsLogged, setUser, } = useGlobalContext();
    const { colors } = useTheme();
    const [selectedItem, setSelectedItem] = useState(null);
    const bottomSheetRef = useRef(null);
    const { orders, fetchUserOrders } = useUserOrders();
    const [modalVisible, setModalVisible] = useState(false);
    const [refModalVisible, setRefModalVisible] = useState(false);
    const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
    const [subModalVisible, setSubModalVisible] = useState(false);
    const { result, loading, setLoading, currency, fetchPortfolioDetails } = usePortfolioDetail();
    const personalSummary = result?.personal_summary;
    const groupSummary = result?.group_summary;
    const overallSummary = result?.overall_summary;

    const personalAccountNet =
        personalSummary?.totalCurrentValue +
        personalSummary?.totalIncome -
        personalSummary?.totalExpenses;

    const groupAccountNet =
        groupSummary?.totalCurrentValue +
        groupSummary?.totalIncome -
        groupSummary?.totalExpenses;

    const overallAccountNet =
        overallSummary?.totalCurrentValue +
        overallSummary?.totalIncome -
        overallSummary?.totalExpenses;



    const signOut = async () => {
        try {
            const response = await axios.post(
                'https://www.realvistamanagement.com/accounts/logout/'
            );
            if (response.status === 200) {
                return true;
            } else {
                console.error("Failed to log out");
                return false;
            }
        } catch (error) {
            Alert.alert('Logout Error', 'Failed to logout. Please try again.');
            return false;
        }
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: 'Manage your properties with Realvista App. It makes real estate investment/management simple and efficient. Get it now: https://play.google.com/store/apps/details?id=com.brillianzhub.realvista',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Shared with activity type:', result.activityType);
                } else {
                    console.log('App shared successfully!');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed.');
            }
        } catch (error) {
            console.error('Error sharing the app:', error);
        }
    };

    const handleRateUs = async () => {
        const appStoreUrl = 'https://apps.apple.com/app/idYOUR_APP_ID';
        const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.brillianzhub.realvista';

        try {
            const storeUrl = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;
            const supported = await Linking.canOpenURL(storeUrl);

            if (supported) {
                await Linking.openURL(storeUrl);
            } else {
                Alert.alert(
                    'Error',
                    'Unable to open the app store. Please try again later.'
                );
            }
        } catch (error) {
            console.error('Error opening store:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
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

    const initialName = user?.name ? user.name.charAt(0).toUpperCase() : '';

    const openTransactionDetails = (item) => {
        setSelectedItem(item);
        bottomSheetRef.current?.expand();
    };

    const handleWithdraw = (amount) => {
        console.log(`Withdrawing amount: ${amount}`);
    };

    const handleCopyReferralCode = async () => {
        if (user?.referral_code) {
            await Clipboard.setStringAsync(user.referral_code); 
            Alert.alert('Copied!', 'Referral code has been copied to your clipboard.');
        } else {
            Alert.alert('Error', 'No referral code available.');
        }
    };

    const closeBottomSheet = () => {
        bottomSheetRef.current?.close();
        setSelectedItem(null);
    };
    const changePlan = () => {
        router.replace('Subscriptions');
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return formattedDate;
    };

    const formattedPlan = user?.subscription?.plan
        ? user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)
        : 'N/A';

    const sortedOrders = orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color="#358B8B" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            <View style={[styles.container, { backgroundColor: colors.background }]}>

                <TouchableOpacity style={styles.imageContainer}>
                    {user?.profile.avatar ? (
                        <Image source={{ uri: user.profile.avatar }} style={styles.avatar} />
                    ) : (
                        <Text style={{ textAlign: 'center' }}>Profile Picture</Text>
                    )}
                </TouchableOpacity>
                <View style={styles.userNameView}>
                    <Text style={styles.userName}>
                        {user?.name && user?.first_name ? `${user.name} ${user.first_name}` : user?.name || user?.first_name}
                    </Text>
                </View>
                <View style={styles.portfolioSummary}>
                    <View style={styles.portfolioNet}>
                        <Text style={styles.portfolioNetText}>Net Worth</Text>
                        <Text style={[styles.portfolioItemText, { color: 'gray', fontWeight: 'normal', fontSize: 14 }]}>Total Current Value + Total Income - Total Expenses</Text>
                    </View>
                    <View style={styles.portfolioItem}>
                        <Text style={styles.portfolioItemText}>Personal Account</Text>
                        <Text style={[styles.portfolioItemText, { color: '#FB902E' }]}>{formatCurrency(personalAccountNet, currency)}</Text>
                    </View>
                    <View style={styles.portfolioItem}>
                        <Text style={styles.portfolioItemText}>Investment Account</Text>
                        <Text style={[styles.portfolioItemText, { color: '#FB902E' }]}>{formatCurrency(groupAccountNet, currency)}</Text>
                    </View>
                    <View style={styles.portfolioItem}>
                        <Text style={styles.portfolioItemText}>Total</Text>
                        <Text style={[styles.portfolioItemText, { color: '#FB902E' }]}>{formatCurrency(overallAccountNet, currency)}</Text>
                    </View>
                </View>

                {user?.subscription ? (
                    <SubscriptionCard
                        user={user}
                        changePlan={changePlan}
                    />
                ) : null}

                <SubscriptionModal visible={subModalVisible} onClose={() => setSubModalVisible(false)} />

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

                    <View style={{ marginVertical: 10 }}>
                        <TouchableOpacity
                            onPress={() => router.replace('Transactions')}
                        >
                            <Text style={{ fontWeight: '600', color: '#358B8B', fontSize: 16 }}>View all</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.portfolioSummary}>
                    <View style={styles.portfolioNet}>
                        <Text style={styles.portfolioNetText}>Basic Info </Text>
                    </View>
                    <View style={styles.portfolioItem}>
                        <TouchableOpacity
                            onPress={() =>
                                Linking.openURL('https://www.realvistaproperties.com/about-us')
                            }
                        >
                            <Text style={styles.portfolioItemText}>About us</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.portfolioItem}>
                        <TouchableOpacity onPress={() => Linking.openURL('mailto:contact@realvistaproperties.com')}>
                            <Text style={styles.portfolioItemText}>Contact us</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.portfolioItem}>
                        <TouchableOpacity onPress={handleShare}>
                            <Text style={styles.portfolioItemText}>Share</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.portfolioItem}>
                        <TouchableOpacity onPress={handleRateUs}>
                            <Text style={styles.portfolioItemText}>Rate us</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.portfolioSummary}>
                    <View style={styles.portfolioNet}>
                        <Text style={styles.portfolioNetText}>Custom settings</Text>
                    </View>
                    <View style={styles.portfolioItem}>
                        <TouchableOpacity onPress={() => router.replace('Settings')}>
                            <Text style={[styles.portfolioItemText]}>Set currency</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.portfolioSummary}>
                    <View style={styles.portfolioNet}>
                        <Text style={styles.portfolioNetText}>Referral Details</Text>
                    </View>
                    <View style={styles.portfolioItem}>
                        <Text style={styles.portfolioKey}>Referral code:</Text>
                        <TouchableOpacity onPress={handleCopyReferralCode} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#358B8B', fontSize: 16, marginRight: 5 }}>{user?.referral_code}</Text>
                            <MaterialIcons name="content-copy" size={20} color="#358B8B" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.portfolioItem}>
                        <Text style={styles.portfolioKey}>Referrer:</Text>
                        <Text style={styles.portfolioValue}>{user?.referrer}</Text>
                    </View>
                    <View style={styles.portfolioItem}>
                        <Text style={styles.portfolioKey}>No. of Referrals:</Text>
                        <Text style={styles.portfolioValue}>{user?.referred_users_count}</Text>
                    </View>

                    <View style={styles.portfolioItem}>
                        <Text style={styles.portfolioKey}>Referral earnings:</Text>
                        <Text style={styles.portfolioValue}>{formatCurrency(user?.total_referral_earnings, currency)}</Text>
                    </View>

                    {!user?.referrer && (
                        <TouchableOpacity
                            style={{ alignItems: 'center', backgroundColor: '#FB902E', padding: 12, borderRadius: 25, marginVertical: 10 }}
                            onPress={() => setRefModalVisible(true)}
                        >
                            <Text style={{ color: 'white' }}>Enter Referral Code</Text>
                        </TouchableOpacity>
                    )}
                    <SubmitReferralModal visible={refModalVisible} onClose={() => setRefModalVisible(false)} />

                    <TouchableOpacity
                        style={{ alignItems: 'center', backgroundColor: '#358B8B', padding: 12, borderRadius: 25, marginVertical: 10 }}
                        onPress={() => setWithdrawModalVisible(true)}
                    >
                        <Text style={{ color: 'white' }}>Withdraw Earnings</Text>
                    </TouchableOpacity>

                    <WithdrawModal
                        visible={withdrawModalVisible}
                        onClose={() => setWithdrawModalVisible(false)}
                        onWithdraw={handleWithdraw}
                        totalEarnings={user?.total_referral_earnings}
                    />
                </View>

                <View style={styles.portfolioSummary}>
                    <View style={styles.portfolioNet}>
                        <Text style={styles.portfolioNetText}>Personal details</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.portfolioItem}
                        onPress={() => router.replace('/update-profile')}
                    >
                        <Text style={styles.portfolioItemText}>Update profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.portfolioItem}
                        onPress={() => router.replace('/change-password')}
                    >
                        <Text style={styles.portfolioItemText}>Change password</Text>
                    </TouchableOpacity>
                    <View style={styles.portfolioItem}>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Text style={[styles.portfolioItemText, { color: 'red' }]}>Delete account</Text>
                        </TouchableOpacity>
                    </View>

                    <DeleteAccountModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                    />
                </View>
                <View style={styles.portfolioSummary}>
                    <TouchableOpacity
                        onPress={logout}
                    >
                        <Image
                            source={images.logout}
                            style={{ height: 24, width: 24, marginTop: 20 }}
                        />
                    </TouchableOpacity>
                </View>

            </View>
        </ScrollView>
    )
}

export default Profile

const { width: screenWidth } = Dimensions.get('window');

const dynamicFontSize = screenWidth < 380 ? 18 : 20;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    userNameView: {
        marginVertical: 10,
    },
    userName: {
        fontSize: 24,
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
        fontSize: dynamicFontSize,
        fontWeight: 'bold'
    },
    portfolioItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },

    portfolioKey: {
        fontSize: 16,
        color: "#666",
        flex: 1,
    },
    portfolioValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        textAlign: "right",
    },
    portfolioItemText: {
        fontSize: 15,
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
    centered: {
        flex: 1,
        alignItems: 'center',
    },

})
