import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Pressable,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import moment from 'moment';
import images from '../../constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const ListingModal = ({ selectedListing, modalVisible, closeModal, setLoading, handleRefresh, navigation }) => {
    if (!selectedListing) return null;

    const handleUpdate = () => {
        const propertyId = selectedListing.id;
        router.push({
            pathname: '/UpdateListing',
            params: { property: propertyId },
        });
        closeModal();
    };


    const handleFeaturesUpdate = () => {
        const propertyId = selectedListing.id;
        router.push({
            pathname: '/MarketFeatures',
            params: { property: propertyId },
        });
        closeModal();
    };


    const handleDelete = async () => {
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('authToken')
            if (!token) { return }

            const response = await fetch(`https://www.realvistamanagement.com/market/delete-property/${selectedListing.id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Property deleted successfully');
                closeModal()
                handleRefresh()
            } else {
                Alert.alert('Error', data.error || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error deleting property:', error);
            Alert.alert('Error', 'An error occurred while deleting the property');
        } finally {
            setLoading(false);
        }
    };

    const formattedDate = moment(selectedListing.listed_date).format('DD-MM-YYYY');

    return (
        <Modal visible={modalVisible} transparent={true} animationType="slide">
            <TouchableWithoutFeedback onPress={closeModal}>
                <View style={styles.modalOverlay}>
                    <Pressable style={styles.modalContent} onPress={() => { }}>
                        <View style={styles.titleRow}>
                            <Text style={styles.modalTitle}>{selectedListing.title}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    closeModal();
                                }}
                            >
                                <Image
                                    source={images.closeModal}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginVertical: 10 }}>
                            <View style={styles.insightAnalysis}>
                                <Text style={styles.modalViews}>Listed on</Text>
                                <Text style={[styles.modalViews, { fontWeight: '600' }]}>{formattedDate}</Text>
                            </View>
                            <View style={styles.insightAnalysis}>
                                <Text style={styles.modalViews}>Total Views</Text>
                                <Text style={[styles.modalViews, { fontWeight: '600' }]}>{selectedListing.views}</Text>
                            </View>
                            <View style={styles.insightAnalysis}>
                                <Text style={styles.modalViews}>Total Inquieries</Text>
                                <Text style={[styles.modalViews, { fontWeight: '600' }]}>{selectedListing.inquiries}</Text>
                            </View>
                            <View style={styles.insightAnalysis}>
                                <Text style={styles.modalViews}>Total Bookmarks</Text>
                                <Text style={[styles.modalViews, { fontWeight: '600' }]}>{selectedListing.bookmarked}</Text>
                            </View>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.updateButton]}
                                onPress={() => {
                                    handleUpdate();
                                }}
                            >
                                <Text style={styles.buttonText}>Update</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.updateFeaturesButton]}
                                onPress={() => {
                                    handleFeaturesUpdate();
                                }}
                            >
                                <Text style={{
                                    color: '#FB902E',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                }}>Update Features</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.delistButton]}
                                onPress={() => {
                                    Alert.alert(
                                        'Confirm Delist',
                                        'Are you sure you want to delist this property?',
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            { text: 'Yes, Delist', onPress: handleDelete },
                                        ]
                                    );
                                }}
                            >
                                <Text style={styles.buttonText}>Delist</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        width: '85%',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        // textAlign: 'left',
        color: '#333',
    },
    modalViews: {
        fontSize: 16,
        marginBottom: 20,
        color: '#666',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        marginHorizontal: 5,
    },
    updateButton: {
        backgroundColor: '#FB902E',
    },
    updateFeaturesButton: {
        borderWidth: 1.5,
        borderColor: '#FB902E',
    },
    delistButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#FB902E',
        paddingVertical: 12,
        width: '100%',
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    insightAnalysis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    }
});

export default ListingModal;
