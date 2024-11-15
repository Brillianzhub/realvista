import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import PropertyDetail from '../../components/PropertyDetail';

const dummyData = require('../../assets/dummyData.json');

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const bottomSheetRef = useRef(null);

  // const openBottomSheet = (item) => {
  //   setSelectedItem(item);
  //   bottomSheetRef.current?.expand();
  // };

  const openBottomSheet = (item) => {
    // alert(`Selected item: ${item.location}`);  // Debug check
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
      <Text style={styles.propertyHeadText}>LOCATION: {item.location}</Text>
      <Text style={styles.propertyText}>DESCRIPTION: {item.description}</Text>
      <Text style={styles.propertyText}>INITIAL COST: {item.initialCost}</Text>
      <Text style={styles.propertyText}>AREA: {item.area}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>PORTFOLIO SUMMARY</Text>
          <Text style={styles.summaryText}>Total Investment: $4000.00</Text>
          <Text style={styles.summaryText}>Total Returns: $4500.00</Text>
          <Text style={styles.summaryText}>Percentage Returns: 25%</Text>
        </View>
      </View>
      <View style={styles.propertiesList}>
        <FlatList
          data={dummyData}
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
