import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import PropertyDetail from '../../components/PropertyDetail';
import useUserProperty from '../../hooks/useUserProperty';
import PropertiesList from '../../components/PropertiesList';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { router } from 'expo-router';
import { calculateUserTotalsWithAnalysis } from '../../utils/calculateUserTotalsWithAnalysis';
import { calculateReturns } from '../../utils/calculateReturns';
import { formatCurrency } from '../../utils/formatCurrency';
import usePortfolioDetail from '../../hooks/usePortfolioDetail';
import { useTheme } from '@/context/ThemeContext';


const WelcomeView = () => (
  <View style={styles.welcomeContainer}>
    <Text style={styles.welcomeText}>Welcome to Your Portfolio!</Text>
    <Text style={styles.instructionText}>
      Start managing your real estate properties today. Tap the "+" button at the bottom right to add your first property!
    </Text>
  </View>
);


const Portfolio = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const bottomSheetRef = useRef(null);
  const { properties, fetchUserProperties, loading } = useUserProperty();
  const userTotalsWithAnalysis = calculateUserTotalsWithAnalysis(properties);
  const userReturns = calculateReturns(properties)
  const [refreshing, setRefreshing] = useState(false);
  const { result, setLoading, currency } = usePortfolioDetail();

  const overallSummary = result?.overall_summary;

  const { colors } = useTheme();

  const totalInvestment = formatCurrency(
    overallSummary?.totalInitialCost + overallSummary?.totalExpenses,
    currency
  );
  const totalCurrentValue = formatCurrency(
    overallSummary?.totalCurrentValue + overallSummary?.totalIncome,
    currency
  );


  const handleAddProperty = () => {
    router.replace('/Manage');
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
      await Promise.all([fetchUserProperties()]);
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

  const handleViewDetails = () => {
    router.replace('/PortfolioDetails')
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.summaryContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.summaryTitle}>Totals</Text>
            <TouchableOpacity
              style={{}}
              onPress={handleViewDetails}
            >
              <Text style={[styles.summaryText, { color: 'gray', fontWeight: 'normal', textDecorationLine: 'underline' }]}>View Details</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.summaryText]}>Investment</Text>
            <Text style={[styles.summaryText, { color: '#000', fontWeight: '600' }]}>{totalInvestment}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.summaryText]}>Current Value</Text>
            <Text style={[styles.summaryText, { color: '#000', fontWeight: 'bold' }]}>{totalCurrentValue}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <Text style={[styles.summaryText]}>Returns</Text>
            {userTotalsWithAnalysis.length === 0 ? (
              <Text style={[styles.summaryText, { color: '#358B8B', fontWeight: 'bold' }]}>0.00 %</Text>
            ) : (
              <Text style={[styles.summaryText, { color: userTotalsWithAnalysis.percentageReturn < 0 ? 'red' : '#358B8B', fontWeight: 'bold' }]}>
                {userTotalsWithAnalysis.percentageReturn}
              </Text>
            )}
          </View>

        </View>
      </View>
      <View style={styles.container}>
        {properties.length === 0 ? (
          <WelcomeView />
        ) : (
          <View style={styles.propertiesList}>
            <View style={styles.listTitle}>
              <Text style={styles.listTitleText}>Investments</Text>
              <Text style={styles.sinceBuy}>%ROI</Text>
            </View>

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

export default Portfolio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
  },
  summaryContainer: {
    width: '95%',
    padding: 15,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#358B8B',
    margin: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9b9696',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 15,
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
  listTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  listTitleText: {
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: 'bold'
  },
  sinceBuy: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gray'
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
    backgroundColor: '#358B8B',
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
