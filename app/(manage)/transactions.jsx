import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState, useRef } from 'react';
import useUserOrders from "../../hooks/useUserOrders";
import images from "../../constants/images";
import { TouchableOpacity } from 'react-native';
import TransactionDetail from '../../components/TransactionDetail';
import BottomSheet from '@gorhom/bottom-sheet';


const Transactions = () => {
    const { orders, fetchUserOrders } = useUserOrders()
    const sortedOrders = orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const [selectedItem, setSelectedItem] = useState(null);
    const bottomSheetRef = useRef(null);

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

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={{ marginVertical: 20 }}>
                    <Text style={{ fontWeight: 18 }}>All Transactions</Text>
                </View>

                {sortedOrders.map((transaction) => (
                    <TouchableOpacity
                        onPress={() => openTransactionDetails(transaction)}
                        key={transaction.id}
                    >
                        <View style={styles.transactionItem} >
                            <View style={styles.transactionViewItem}>

                                <View style={styles.transactionsPoint}>
                                    <Image
                                        source={images.buyOrder}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.portfolioItemText}>{transaction.project.name}</Text>
                                    <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                                        <Text style={styles.notificationsDate}>Buy Order</Text>
                                        <Text style={styles.notificationsDate}> - {formatDate(transaction.created_at)}</Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.portfolioItemText}>${transaction.total_amount}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

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
            </View>
        </ScrollView>
    )
}

export default Transactions;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    transactionItem: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginVertical: 20,
        alignItems: 'center'
    },
    transactionViewItem: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center'
    },
    transactionsPoint: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: '#358B8B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    portfolioItemText: {
        fontSize: 16,
        fontWeight: '600',
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