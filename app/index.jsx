import { StyleSheet, Text, View, Pressable, ImageBackground } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import images from '../constants/images';


const Index = () => {
  const router = useRouter();
  const handleNavigation = () => {
    router.replace('/sign-in');
  };

  return (
    <ImageBackground
      source={images.landing}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Pressable onPress={handleNavigation} style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

export default Index;

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
  button: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: '#FB902E',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});
