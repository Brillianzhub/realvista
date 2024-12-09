import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import PropertyDetail from '../../components/PropertyDetail';
import useUserProperty from '../../hooks/useUserProperty';
import PropertiesList from '../../components/PropertiesList';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { initializePushNotifications } from '../../utils/notifications';
import { router } from 'expo-router';
import { calculateUserTotalsWithAnalysis } from '../../utils/calculateUserTotalsWithAnalysis';
import { calculateReturns } from '../../utils/calculateReturns';
import { useCurrency } from '../../context/CurrencyContext';
import { formatCurrency } from '../../utils/formatCurrency';



const WelcomeView = () => (
  <View style={styles.welcomeContainer}>
    <Text style={styles.welcomeText}>Welcome to Your Portfolio!</Text>
    <Text style={styles.instructionText}>
      Start managing your real estate properties today. Tap the "+" button at the bottom right to add your first property!
    </Text>
    <TouchableOpacity style={styles.addButton1}>
      <Text style={styles.addButtonText}>Add Your First Property</Text>
    </TouchableOpacity>
  </View>
);


const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const bottomSheetRef = useRef(null);
  const { properties, fetchUserProperties } = useUserProperty();
  const userTotalsWithAnalysis = calculateUserTotalsWithAnalysis(properties);
  const userReturns = calculateReturns(properties)

  const [refreshing, setRefreshing] = useState(false);

  const { currency } = useCurrency();

  const totalInvestment = formatCurrency(userTotalsWithAnalysis.totalInvestment, currency);
  const totalProfit = formatCurrency(userTotalsWithAnalysis.totalProfit, currency);

  const handleAddProperty = () => {
    router.replace('/manage_property');
  };

  useEffect(() => {
    initializePushNotifications();
  }, []);

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
      await Promise.all([fetchUserProperties()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>PORTFOLIO SUMMARY</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>Total Investment</Text>
            <Text style={[styles.summaryText, { color: '#FB902E', fontWeight: 'bold' }]}>{totalInvestment}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>Total Returns</Text>
            <Text style={[styles.summaryText, { color: '#FB902E', fontWeight: 'bold' }]}>{totalProfit}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>Percentage Returns</Text>
            {userTotalsWithAnalysis.length === 0 ? (
              <Text style={[styles.summaryText, { color: '#FB902E', fontWeight: 'bold' }]}>0.00 %</Text>
            ) : (
              <Text style={[styles.summaryText, { color: '#FB902E', fontWeight: 'bold' }]}>{userTotalsWithAnalysis.percentageReturn}</Text>
            )}
          </View>
        </View>
      </View>
      <View style={styles.container}>
        {properties.length === 0 ? (
          <WelcomeView />
        ) : (
          <View style={styles.propertiesList}>
            <PropertiesList
              properties={userReturns}
              onPress={openBottomSheet}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddProperty}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

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
          <PropertyDetail
            selectedItem={selectedItem}
            closeBottomSheet={closeBottomSheet}
            mapType={mapType}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#358B8B'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    marginTop: 15
  },
  summaryContainer: {
    backgroundColor: '#fff',
    width: '90%',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
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
    backgroundColor: '#358B8B',
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
