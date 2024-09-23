import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

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

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.location}>{item.location}</Text>
      <Text>
        Initial Cost: ${item.initialCost.toLocaleString()}
      </Text>
      <Text>
        Current Cost: ${item.currentCost.toLocaleString()}
      </Text>
      <Text>
        Percentage Return: {item.percentageReturn}%
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>RealVista Portfolio</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
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
});

export default HomeScreen;
