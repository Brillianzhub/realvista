import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import useGroupProperty from '../../hooks/useGroupProperty';
import PropertyListingDetail from '../Order/PropertyListingView';
import GroupPropertiesList from './GroupPropertyListing';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { calculateReturns } from '../../utils/calculateReturns';
import useFetchAdminDeviceTokens from "../../hooks/useFetchAdminDeviceTokens";


const WelcomeView = () => (
    <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome to Your Group Portfolio!</Text>
        <Text style={styles.instructionText}>
            Start managing your real estate properties today. Are you Admin of the group? then tap the "+" button at the bottom right to add your first property! This button is only available to the admin.
        </Text>
    </View>
);


const PropertyListScreen = ({ route, navigation }) => {
    const { groupId, uniqueGroupId, role } = route.params;
    const { deviceTokens } = useFetchAdminDeviceTokens(uniqueGroupId);
    const [selectedItem, setSelectedItem] = useState(null);
    const [mapType, setMapType] = useState('standard');
    const bottomSheetRef = useRef(null);
    const { properties, fetchGroupProperties, loading } = useGroupProperty({ uniqueGroupId });
    const userReturns = calculateReturns(properties)
    
    const [refreshing, setRefreshing] = useState(false);

    const handleAddProperty = () => {
        navigation.navigate('ManageGroupProperty', { uniqueGroupId: uniqueGroupId });
    };

    const openBottomSheet = (item) => {
        setSelectedItem(item);
        bottomSheetRef.current?.expand();
    };

    const closeBottomSheet = () => {
        bottomSheetRef.current?.close();
        setSelectedItem(null);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await Promise.all([fetchGroupProperties()]);
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#358B8B" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                {properties.length === 0 ? (
                    <WelcomeView />
                ) : (
                    <View style={styles.propertiesList}>
                        <GroupPropertiesList
                            properties={userReturns}
                            onPress={openBottomSheet}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    </View>
                )}
            </View>
            {(role === 'SUPERADMIN' || role === 'ADMIN') && (
                <TouchableOpacity style={styles.addButton} onPress={handleAddProperty}>
                    <Ionicons name="add" size={30} color="white" />
                </TouchableOpacity>
            )}
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={['25%', '50%', '100%']}
                enablePanDownToClose={true}
                onClose={closeBottomSheet}
                enableContentPanningGesture={true}
                handleStyle={styles.handleContainer}
                handleIndicatorStyle={styles.handleIndicator}
            >
                <BottomSheetScrollView
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <PropertyListingDetail
                        selectedItem={selectedItem}
                        closeBottomSheet={closeBottomSheet}
                        mapType={mapType}
                        role={role}
                        deviceTokens={deviceTokens}
                        navigation={navigation}
                        uniqueGroupId={uniqueGroupId}
                        onRefresh={onRefresh}
                    />
                </BottomSheetScrollView>
            </BottomSheet>
        </View>
    );
};

export default PropertyListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    propertiesList: {
        flex: 1,
        padding: 10,
    },
    propertyItem: {
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: '#358B8B1A',
        padding: 10
    },
    propertyHeadText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        color: '#FB902E',
        fontWeight: 'bold'
    },
    propertyText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#FB902E',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    handleIndicator: {
        backgroundColor: '#136e8b',
        width: 50,
        height: 5,
        borderRadius: 3,
    },
    handleContainer: {
        backgroundColor: '#358B8B1A',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },

    welcomeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
    },
    instructionText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        paddingHorizontal: 20,
    },
    addButton1: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
