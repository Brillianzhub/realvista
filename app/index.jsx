import { StyleSheet, Text, View, Pressable, ImageBackground } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import images from '../constants/images';

const index = () => {

  const handleNavigation = () => {
    router.replace('/sign-in');
  };

  return (
    <ImageBackground
      source={images.landing}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Pressable onPress={handleNavigation}>
          <Text style={styles.text}>Press to Continue</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

export default index;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});
