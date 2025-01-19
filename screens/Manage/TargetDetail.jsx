import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { Ionicons } from '@expo/vector-icons';
import images from '../../constants/images';
import AddContributionModal from '../Analysis/AddContributionModal';



const TargetDetail = ({ selectedTarget, closeBottomSheet }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const targetId = selectedTarget?.id;
    let color = 'green';

    if (selectedTarget?.progress_percentage > 100) {
        color = 'red';
    } else if (selectedTarget?.progress_percentage <= 10) {
        color = 'orange';
    }

    const handleContributionSuccess = () => {
        // Reload data or update state
        console.log('Contribution added successfully');
    };

    return (
        <ScrollView
            nestedScrollEnabled={true}
            contentContainerStyle={{ flex: 1 }}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Target Progress Overview</Text>
                <TouchableOpacity onPress={closeBottomSheet}>
                    <Ionicons name="close" size={24} color="#358B8B" style={styles.closeIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.bottomSheetContent}>
                {selectedTarget ? (
                    <>
                        <View style={styles.overview}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Image
                                    source={images.target}
                                    resizeMode='cover'
                                    height={20}
                                    width={20}
                                />
                                <View>
                                    <Text style={styles.sheetHeader}>{selectedTarget.target_name}</Text>
                                </View>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.sheetDetails}>
                                    Target Amount
                                </Text>
                                <Text style={[styles.sheetDetails, { fontWeight: 'bold' }]}>
                                    {formatCurrency(selectedTarget.target_amount, selectedTarget.currency)}
                                </Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.sheetDetails}>
                                    Current Savings
                                </Text>
                                <Text style={[styles.sheetDetails, { fontWeight: 'bold' }]}>
                                    {formatCurrency(selectedTarget.current_savings, selectedTarget.currency)}
                                </Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.sheetDetails}>
                                    Progress
                                </Text>
                                <Text style={[styles.sheetDetails, { fontWeight: 'bold', color }]}>
                                    {selectedTarget.progress_percentage.toFixed(2)}%
                                </Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.sheetDetails}>
                                    Remaining Amount
                                </Text>
                                <Text style={[styles.sheetDetails, { fontWeight: 'bold' }]}>
                                    {formatCurrency(selectedTarget.remaining_amount, selectedTarget.currency)}
                                </Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.sheetDetails}>
                                    Months Remaining
                                </Text>
                                <Text style={[styles.sheetDetails, { fontWeight: 'bold' }]}>
                                    {selectedTarget.months_remaining}
                                </Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.sheetDetails}>
                                    Minimum Monthly Contribution
                                </Text>
                                <Text style={[styles.sheetDetails, { fontWeight: 'bold' }]}>
                                    {formatCurrency(selectedTarget.minimum_monthly_contribution, selectedTarget.currency)}
                                </Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.sheetDetails}>
                                    Start Date
                                </Text>
                                <Text style={[styles.sheetDetails, { fontWeight: 'bold' }]}>
                                    {selectedTarget.start_date}
                                </Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.sheetDetails}>
                                    End Date
                                </Text>
                                <Text style={[styles.sheetDetails, { fontWeight: 'bold' }]}>
                                    {selectedTarget.end_date}
                                </Text>
                            </View>
                        </View>
                        {selectedTarget.achieved_at && (
                            <Text style={styles.sheetDetails}>
                                Achieved At: {selectedTarget.achieved_at}
                            </Text>
                        )}
                        <Text style={styles.sheetHeader}>Contributions:</Text>
                        {selectedTarget.contributions.length > 0 ? (
                            selectedTarget.contributions.map((contribution) => (
                                <View key={contribution.id} style={[styles.contributionItem, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                                    <View style={{ flexDirection: 'col', justifyContent: 'space-between' }}>
                                        <Text style={[styles.contributionDetails, { fontWeight: 'bold' }]}>
                                            Amount contributed
                                        </Text>
                                        <Text style={styles.contributionDetails}>
                                            {contribution.date}
                                        </Text>
                                    </View>
                                    <Text style={[styles.contributionDetails, { fontWeight: 'bold' }]}>
                                        {formatCurrency(contribution.amount, selectedTarget.currency)}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.sheetDetails}>No Contributions Yet</Text>
                        )}
                    </>
                ) : (
                    <Text>Loading...</Text>
                )}


            </View>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
            <AddContributionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                targetId={targetId}
                onSuccess={handleContributionSuccess}
            />
        </ScrollView>
    )
}

export default TargetDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomSheetContent: {
        flex: 1,
        padding: 16,
        backgroundColor: '#358B8B1A',
    },
    detailItem: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sheetHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
        color: '#333',
    },
    sheetDetails: {

        fontSize: 16,
        marginVertical: 4,
    },
    overview: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10
    },
    contributionItem: {
        marginVertical: 4,
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    contributionDetails: {
        fontSize: 14,
    },
    header: {
        backgroundColor: '#358B8B1A',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {

        fontSize: 18,
        color: '#358B8B',
        fontWeight: 'bold',
    },
    closeIcon: {
        padding: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#FB902E',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
})