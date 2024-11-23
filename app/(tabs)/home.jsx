import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import PropertyDetail from '../../components/PropertyDetail';
// import { useInvestmentData } from '@/context/InvestmentProvider';
import { useGlobalContext } from '@/context/GlobalProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



const Home = () => {
  const { user } = useGlobalContext();
  const [selectedItem, setSelectedItem] = useState(null);
  const [portfolioSum, setPortfolioSum] = useState(0);
  const [percentageReturn, setPercentageReturns] = useState(0);
  const [mapType, setMapType] = useState('standard');
  const bottomSheetRef = useRef(null);

  const [orders, setOrders] = useState([]);
  const [percentageOwner, setPercentageOwner] = useState(0);
  // const [loading, setLoading] = useState(true);

  const totalPortfolioValue = portfolioSum.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const fetchUserOrder = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.log("Token required for this operation");
        return;
      }

      const user_email = user?.email;
      if (!user_email) {
        console.log("User email is not available");
        return;
      }

      const response = await axios.get(`https://brillianzhub.eu.pythonanywhere.com/order/user-orders/by_user_email/?user_email=${user_email}`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setOrders(response.data);
    } catch (error) {
      console.error("Encountered error while loading the data", error);
    }
  }

  // console.log(orders[0].project.num_slots)

  useEffect(() => {
    let sum = 0;
    for (i = 0; i < orders.length - 1; i++) {
      sum += parseFloat(orders[i].total_amount);
    }
    setPortfolioSum(sum)

    const increase = ((100000 - sum) / 100000) * 100;
    setPercentageReturns(increase)

    for (i = 0; i < orders.length - 1; i++) {
      console.log(orders[i].quantity)
    }

  }, [orders])


  useEffect(() => {
    fetchUserOrder()
  }, [user?.email])


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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.propertyItem} onPress={() => openBottomSheet(item)}>
      <Text style={styles.propertyHeadText}>Project: {item.project_name}</Text>
      <Text style={styles.propertyText}>Initial Investment: {item.total_amount}</Text>
      <Text style={styles.propertyText}>Current Value: {item.total_amount}</Text>
      <Text style={styles.propertyText}>Number of Slots: {item.quantity}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>PORTFOLIO SUMMARY</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>Total Investment</Text>
            <Text style={[styles.summaryText, { color: '#FB902E', fontWeight: 'bold' }]}>${totalPortfolioValue}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>Total Returns</Text>
            <Text style={[styles.summaryText, { color: '#FB902E', fontWeight: 'bold' }]}>$4500.00</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>Percentage Returns</Text>
            <Text style={[styles.summaryText, { color: '#FB902E', fontWeight: 'bold' }]}>{percentageReturn}%</Text>
          </View>
        </View>
      </View>
      <View style={styles.propertiesList}>
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => alert('Add Property')}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <PropertyDetail
        selectedItem={selectedItem}
        closeBottomSheet={closeBottomSheet}
        toggleMapType={toggleMapType}
        mapType={mapType}
        bottomSheetRef={bottomSheetRef}
      />
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
    backgroundColor: '#358B8B', // Set your desired background color
    width: 60, // Set the width of the circle
    height: 60, // Set the height of the circle
    borderRadius: 30, // Make the button circular by setting borderRadius to half the width/height
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Optional: Adds a shadow effect to the button
  },
});
