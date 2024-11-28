import { StyleSheet, Text, View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import PropertyDetail from '../../components/PropertyDetail';
import useUserDividends from '../../hooks/useUserDividends';
import useUserHoldings from '../../hooks/useUserHoldings';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";


const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [portfolioSum, setPortfolioSum] = useState(0);
  const [totalReturn, setTotalReturn] = useState(0);
  const [percentageReturn, setPercentageReturns] = useState(0);
  const [mapType, setMapType] = useState('standard');
  const bottomSheetRef = useRef(null);
  const [mergedData, setMergedData] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const { dividends, fetchDividends } = useUserDividends();
  const { holdings, fetchUserHoldings } = useUserHoldings();


  const totalPortfolioValue = portfolioSum.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  useEffect(() => {
    if (!holdings || !dividends) return;

    const dividendMap = dividends.reduce((acc, dividend) => {
      const projectId = dividend.project.id;
      if (!acc[projectId]) {
        acc[projectId] = [];
      }
      acc[projectId].push(dividend);
      return acc;
    }, {});

    const merged = holdings.map(holding => {
      const projectId = holding.project.id;
      const relatedDividends = dividendMap[projectId] || [];
      return {
        ...holding,
        dividends: relatedDividends,
      };
    });

    setMergedData(merged);

    const totalInvestment = merged.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    setPortfolioSum(totalInvestment);

    const totalReturns = merged.reduce(
      (sum, item) =>
        sum +
        item.dividends.reduce(
          (divSum, div) =>
            divSum +
            div.shares.reduce((shareSum, share) => shareSum + parseFloat(share.final_share_amount || 0), 0),
          0
        ),
      0
    );

    setTotalReturn(totalReturns.toFixed(2));
    setPercentageReturns(((totalReturns / totalInvestment) * 100).toFixed(2));
  }, [holdings, dividends]);


  const openBottomSheet = (item) => {
    setSelectedItem(item);
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
    setSelectedItem(null);
  };

  const toggleMapType = () => {
    setMapType((prevType) => (prevType === 'standard' ? 'satellite' : 'standard'));
  }


  const renderItem = useCallback(
    ({ item }) => {
      const totalUserShare = item.dividends.reduce((sum, dividend) => {
        const sharesSum = dividend.shares.reduce(
          (shareSum, share) => shareSum + parseFloat(share.final_share_amount || 0),
          0
        );
        return sum + sharesSum;
      }, 0);

      const currentValue = parseFloat(item.amount) + totalUserShare;

      const percentageReturn = ((totalUserShare / parseFloat(item.amount)) * 100).toFixed(2);

      return (
        <TouchableOpacity style={styles.propertyItem} onPress={() => openBottomSheet(item)}>
          <Text style={styles.propertyHeadText}>Project: {item.project.name}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.propertyText}>Initial Investment</Text>
            <Text style={styles.propertyText}>${item.amount}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.propertyText}>Current Value</Text>
            <Text style={styles.propertyText}>${currentValue.toFixed(2)}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.propertyText}>Percentage Return</Text>
            {isNaN(percentageReturn) || percentageReturn === null ? (
              <Text style={styles.propertyText}>0.00%</Text>
            ) : (
              <Text style={styles.propertyText}>{percentageReturn}%</Text>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [mergedData]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchDividends(), fetchUserHoldings()]);
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
            <Text style={[styles.summaryText, { color: '#FB902E', fontWeight: 'bold' }]}>$ {totalPortfolioValue}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>Total Returns</Text>
            <Text style={[styles.summaryText, { color: '#FB902E', fontWeight: 'bold' }]}>$ {totalReturn}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>Percentage Returns</Text>
            {isNaN(percentageReturn) || percentageReturn === null ? (
              <Text style={[styles.summaryText, { color: '#FB902E', fontWeight: 'bold' }]}>0.00 %</Text>
            ) : (
              <Text style={[styles.summaryText, { color: '#FB902E', fontWeight: 'bold' }]}>{percentageReturn}%</Text>
            )}
          </View>
        </View>
      </View>
      <View style={styles.propertiesList}>
        <FlatList
          data={mergedData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => alert('Add Property')}>
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
            toggleMapType={toggleMapType}
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
});
