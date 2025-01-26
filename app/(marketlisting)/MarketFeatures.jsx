import React, { useState } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MarketFeaturesForm = () => {
  const { property } = useLocalSearchParams();


  const [formData, setFormData] = useState({
    negotiable: 'no',
    furnished: false,
    pet_friendly: false,
    parking_available: false,
    swimming_pool: false,
    garden: false,
    electricity_proximity: 'moderate',
    road_network: 'good',
    development_level: 'moderate',
    water_supply: false,
    security: false,
    additional_features: '',
  });

  const handleInputChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleSubmit = async () => {
    try {

      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        Alert.alert('Error', 'Authentication token required!');
        return;
      }
      const response = await axios.post(
        `https://realvistamanagement.com/market/property/${property}/features/`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );
      Alert.alert('Success', 'Features successfully submitted!');
      router.replace('/MarketListing');
    } catch (error) {
      console.error(error);
      alert('Error submitting features. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.title}>Select what applies</Text>

      <Text style={styles.label}>Is the price negotiable?</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.negotiable}
          onValueChange={(value) => handleInputChange('negotiable', value)}
        >
          <Picker.Item label="Yes" value="yes" />
          <Picker.Item label="Slightly" value="slightly" />
          <Picker.Item label="No" value="no" />
        </Picker>
      </View>

      <View style={styles.switchContainer}>
        <Text>Furnished</Text>
        <Switch
          value={formData.furnished}
          onValueChange={(value) => handleInputChange('furnished', value)}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text>Pet Friendly</Text>
        <Switch
          value={formData.pet_friendly}
          onValueChange={(value) => handleInputChange('pet_friendly', value)}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text>Parking Available</Text>
        <Switch
          value={formData.parking_available}
          onValueChange={(value) => handleInputChange('parking_available', value)}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text>Swimming Pool</Text>
        <Switch
          value={formData.swimming_pool}
          onValueChange={(value) => handleInputChange('swimming_pool', value)}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text>Garden</Text>
        <Switch
          value={formData.garden}
          onValueChange={(value) => handleInputChange('garden', value)}
        />
      </View>

      <Text style={styles.label}>Electricity Proximity</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.electricity_proximity}
          onValueChange={(value) => handleInputChange('electricity_proximity', value)}
        >
          <Picker.Item label="Nearby (Less than 100m)" value="nearby" />
          <Picker.Item label="Moderate (100m - 500m)" value="moderate" />
          <Picker.Item label="Far (Above 500m)" value="far" />
        </Picker>
      </View>
      <Text style={styles.label}>Road Network</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.road_network}
          onValueChange={(value) => handleInputChange('road_network', value)}
        >
          <Picker.Item label="Excellent" value="excellent" />
          <Picker.Item label="Good" value="good" />
          <Picker.Item label="Fair" value="fair" />
          <Picker.Item label="Poor" value="poor" />
        </Picker>
      </View>
      <Text style={styles.label}>Development Level</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.development_level}
          onValueChange={(value) => handleInputChange('development_level', value)}
        >
          <Picker.Item label="Highly Developed" value="high" />
          <Picker.Item label="Moderately Developed" value="moderate" />
          <Picker.Item label="Sparsely Developed" value="low" />
          <Picker.Item label="Undeveloped" value="undeveloped" />
        </Picker>
      </View>
      <View style={styles.switchContainer}>
        <Text>Water Supply (Borehole inclusive)</Text>
        <Switch
          value={formData.water_supply}
          onValueChange={(value) => handleInputChange('water_supply', value)}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text>Security</Text>
        <Switch
          value={formData.security}
          onValueChange={(value) => handleInputChange('security', value)}
        />
      </View>

      <Text style={styles.label}>Additional Features</Text>
      <TextInput
        style={styles.textInput}
        value={formData.additional_features}
        onChangeText={(text) => handleInputChange('additional_features', text)}
        placeholder="Add any additional features"
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

    </ScrollView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9', // Slightly off-white for better aesthetics
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1, // Light border
    borderColor: '#ccc', // Light gray color
    borderRadius: 25, // Rounded corners for a modern look
    marginTop: 12, // Space above the picker
    marginBottom: 16, // Space below the picker
    overflow: 'hidden', // Ensures the picker stays within the rounded border
  },


  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333', // Darker color for better readability
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12, // Increased vertical margin for better spacing
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8, // Rounded corners for a modern look
    padding: 12, // Increased padding for a more user-friendly input field
    marginTop: 12,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 24,
  },
  submitButton: {
    backgroundColor: '#FB902E',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },


});

export default MarketFeaturesForm;
