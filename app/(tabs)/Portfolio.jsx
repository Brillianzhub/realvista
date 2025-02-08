import { StyleSheet, Text, View, TouchableOpacity, Modal, ActivityIndicator, TouchableWithoutFeedback, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import useUserProperty from '../../hooks/useUserProperty';
import PropertiesList from '../../components/PropertiesList';
import { router } from 'expo-router';
import { calculateUserTotalsWithAnalysis } from '../../utils/calculateUserTotalsWithAnalysis';
import { calculateReturns } from '../../utils/calculateReturns';
import { formatCurrency } from '../../utils/formatCurrency';
import usePortfolioDetail from '../../hooks/usePortfolioDetail';
import { useTheme } from '@/context/ThemeContext';
import DragableAddButton from '../../components/Portfolio/DragableAddButton'

const WelcomeView = () => (
  <View style={styles.welcomeContainer}>
    <Text style={styles.welcomeText}>Welcome to Your Portfolio!</Text>
    <Text style={styles.instructionText}>
      Start managing your real estate properties today. Tap the "+" button at the bottom right to add your first property!
    </Text>
  </View>
);


const Portfolio = () => {
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

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handlePortfolioDetail = ({ item }) => {
    router.push({
      pathname: '/(portfoliodetail)/PortfolioDetails',
      params: { selectedItem: JSON.stringify(item) },
    })
  }

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
      <View style={{ backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#358B8B" />
      </View>
    );
  }


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { marginVertical: 20 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontFamily: 'RobotoSerif-Regular', color: 'gray', fontWeight: '600' }}>
            Total Value
          </Text>
          <TouchableOpacity onPress={openModal} style={{ marginLeft: 8 }}>
            <Ionicons name="help-circle-outline" size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.summaryText, { color: '#000', fontSize: 24, fontWeight: 'bold' }]}>{totalCurrentValue}</Text>
        <Text style={{ fontSize: 18, fontFamily: 'RobotoSerif-Regular', color: 'gray' }}>{`${properties.length} Assets`}</Text>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>
                    <Text style={styles.modalSubText}>Total Value:</Text>{' '}
                    The Total Value is the sum of all current values of investments and all recorded incomes.
                    {"\n\n"}
                    <Text style={styles.modalSubText}>Investment:</Text>{' '}
                    Total Investment refers to the total sum of all initial costs of all assets, along with all recorded expenses.
                    {"\n\n"}
                    <Text style={styles.modalSubText}>Returns:</Text>{' '}
                    Total Returns represent the percentage returns for all investments in relation to the total value.
                  </Text>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
      <View style={styles.subheader}>
        <View style={styles.subheaderItem}>
          <Text style={{ fontFamily: 'RobotoSerif-Regular', fontSize: 17, color: '#FB902E' }}>Total Invested</Text>
          <Text style={[styles.summaryText, { color: '#000', fontWeight: 'bold', fontSize: 14 }]}>{totalInvestment}</Text>
        </View>
        <View style={styles.subheaderItem}>
          <Text style={{ fontFamily: 'RobotoSerif-Regular', fontSize: 17, color: '#FB902E' }}>Total Returns</Text>
          {userTotalsWithAnalysis.length === 0 ? (
            <Text style={[styles.summaryText, { color: '#358B8B', fontWeight: 'bold' }]}>0.00 %</Text>
          ) : (
            <Text style={[styles.summaryText, { color: userTotalsWithAnalysis.percentageReturn < 0 ? 'red' : '#358B8B', fontWeight: 'bold' }]}>
              {userTotalsWithAnalysis.percentageReturn}
            </Text>
          )}
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
              onPress={handlePortfolioDetail}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          </View>
        )}
      </View>

      <DragableAddButton
        handleAddProperty={handleAddProperty}
      />
    </View>
  );
};

export default Portfolio;

const { width: screenWidth } = Dimensions.get('window');

const dynamicFontSize = screenWidth < 380 ? 10 : 12;

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
  subheader: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  subheaderItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

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
    fontFamily: 'RobotoSerif-Regular',
    color: '#555',
  },
  propertiesList: {
    flex: 1,
    padding: 10,
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
  modalSubText: {
    fontWeight: 'bold',
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'left',
    marginBottom: 20,
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


  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },

  closeButton: {
    backgroundColor: '#FB902E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
