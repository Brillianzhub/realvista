import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Pressable } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import dummyData from '../../assets/data.json';
import { useGlobalContext } from '../../context/GlobalProvider';


const R = 6371000;

// Haversine Distance Calculation
const haversineDistance = (coord1, coord2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const lat1 = coord1.latitude;
  const lon1 = coord1.longitude;
  const lat2 = coord2.latitude;
  const lon2 = coord2.longitude;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Shoelace formula to calculate land area
const calculateAreaInSquareMeters = (coordinates) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000;

  let area = 0;

  if (coordinates.length > 2) {
    for (let i = 0; i < coordinates.length; i++) {
      const lat1 = toRad(coordinates[i].latitude);
      const lon1 = toRad(coordinates[i].longitude);
      const lat2 = toRad(coordinates[(i + 1) % coordinates.length].latitude);
      const lon2 = toRad(coordinates[(i + 1) % coordinates.length].longitude);

      area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }

    area = (Math.abs(area) * R * R) / 2.0;
  }

  return Math.abs(area);
};

const HomeScreen = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();

  const [data] = useState(dummyData);
  const [selectedItem, setSelectedItem] = useState(null);
  const bottomSheetRef = useRef(null);
  const [mapType, setMapType] = useState('standard');
  const mapRef = useRef(null);
  const snapPoints = useMemo(() => ['50%', '95%'], []);

  const totalInvested = data.reduce((acc, item) => acc + item.initialCost, 0);
  const totalReturns = data.reduce((acc, item) => acc + item.currentCost, 0);
  const percentageReturn = ((totalReturns - totalInvested) / totalInvested) * 100;

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
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => openBottomSheet(item)}
    >
      <Text style={styles.location}>{item.location}</Text>
      <Text>Initial Cost: ${item.initialCost.toLocaleString()}</Text>
      <Text>Land Area: {calculateAreaInSquareMeters(item.coordinates).toFixed(2)} m²</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.header}>RealVista Portfolio Summary</Text>
        <Text>Total Invested: ${totalInvested.toLocaleString()}</Text>
        <Text>Total Returns: ${totalReturns.toLocaleString()}</Text>
        <Text>Percentage Return: {percentageReturn.toFixed(2)}%</Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={closeBottomSheet}
        enableContentPanningGesture={true}
      >
        <View style={styles.bottomSheetContent}>
          {selectedItem && (
            <>
              <Text style={styles.modalTitle}>{selectedItem.location}</Text>
              <Text>Initial Cost: ${selectedItem.initialCost.toLocaleString()}</Text>
              <Text>Current Cost: ${selectedItem.currentCost.toLocaleString()}</Text>
              <Text>Percentage Return: {selectedItem.percentageReturn}%</Text>
              <MapView
                ref={mapRef}
                style={styles.map}
                mapType={mapType}
                initialRegion={{
                  latitude: selectedItem.coordinates[0].latitude,
                  longitude: selectedItem.coordinates[0].longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                showsUserLocation={true}
                zoomEnabled={true}
                scrollEnabled={true}
                pitchEnabled={true}
              >
                <Marker
                  coordinate={selectedItem.coordinates[0]}
                  title={selectedItem.location}
                />
                <Polygon
                  coordinates={selectedItem.coordinates}
                  fillColor="rgba(0, 200, 0, 0.3)"
                  strokeColor="rgba(0,0,0,0.5)"
                  strokeWidth={2}
                />
              </MapView>
            </>
          )}
          <View >
            <Pressable onPress={toggleMapType} style={{ backgroundColor: '#136e8b', width: '50%', padding: 10, borderRadius: 5 }}>
              <Text style={{ color: 'white' }}>Toggle Map</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheet>
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
    padding: 10,
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
  bottomSheetContent: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  map: {
    width: '100%',
    height: '70%',
    marginVertical: 10,
  },
});

export default HomeScreen;
