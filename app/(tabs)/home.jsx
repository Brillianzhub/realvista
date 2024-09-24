import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Modal, TouchableOpacity, Button } from 'react-native';

const dummyData = [
  {
    id: '1',
    location: 'New York',
    initialCost: 100000,
    currentCost: 120000,
    percentageReturn: 20,
  },
  {
    id: '2',
    location: 'Los Angeles',
    initialCost: 80000,
    currentCost: 95000,
    percentageReturn: 18.75,
  },
  {
    id: '3',
    location: 'Chicago',
    initialCost: 90000,
    currentCost: 105000,
    percentageReturn: 16.67,
  },
  {
    id: '4',
    location: 'Houston',
    initialCost: 70000,
    currentCost: 85000,
    percentageReturn: 21.43,
  },
  {
    id: '5',
    location: 'Seattle',
    initialCost: 110000,
    currentCost: 130000,
    percentageReturn: 18.18,
  },
];

const HomeScreen = () => {
  const [data, setData] = useState(dummyData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Calculate total investment and total return
  const totalInvested = data.reduce((acc, item) => acc + item.initialCost, 0);
  const totalReturns = data.reduce((acc, item) => acc + item.currentCost, 0);

  // Calculate the percentage return on investment (ROI)
  const percentageReturn = ((totalReturns - totalInvested) / totalInvested) * 100;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setSelectedItem(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.location}>{item.location}</Text>
      <Text>Initial Cost: ${item.initialCost.toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.header}>Portfolio Summary</Text>
        <Text>Total Invested: ${totalInvested.toLocaleString()}</Text>
        <Text>Total Returns: ${totalReturns.toLocaleString()}</Text>
        <Text>Percentage Return: {percentageReturn.toFixed(2)}%</Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      {selectedItem && (
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>{selectedItem.location}</Text>
              <Text>Initial Cost: ${selectedItem.initialCost.toLocaleString()}</Text>
              <Text>Current Cost: ${selectedItem.currentCost.toLocaleString()}</Text>
              <Text>Percentage Return: {selectedItem.percentageReturn}%</Text>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  summary: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#eef',
    borderRadius: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  location: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});

export default HomeScreen;
