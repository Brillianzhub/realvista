import { StyleSheet, Text, View, Pressable, ImageBackground, Image, Dimensions, Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import PagerView from 'react-native-pager-view';
import images from '../constants/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../context/GlobalProvider';
import FingerprintAuth from '../components/FingerprintAuth';



const { width, height } = Dimensions.get('window');

const Index = () => {
  const { setUser, isLogged, setIsLogged } = useGlobalContext();

  const router = useRouter();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 3;

  const messages = [
    "Grow your wealth, one property at a time.",
    "Real-time insights, real-time decisions. Act now.",
    "The future of real estate investment is here.",
  ];

  const handleSignUp = () => {
    router.replace('/sign-up');
  };

  const handleLogin = () => {
    router.replace('sign-in');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={images.onboarding}
        style={styles.topSection}
        resizeMode="cover"
      >
        <Text style={styles.welcomeTitle}>Welcome to Realvista</Text>
        <Animated.Text style={[styles.titleText, { opacity: fadeAnim }]}>
          {messages[currentMessageIndex]}
        </Animated.Text>
      </ImageBackground>

      <View style={styles.middleSection}>
        <PagerView
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          <View key="1" style={styles.page}>
            <Image
              source={images.onboardCarOne}
              style={styles.middleImage}
              resizeMode="contain"
            />
          </View>
          <View key="2" style={styles.page}>
            <Image
              source={images.onboardCarTwo}
              style={styles.middleImage}
              resizeMode="contain"
            />
          </View>
          <View key="3" style={styles.page}>
            <Image
              source={images.onboardCarThree}
              style={styles.middleImage}
              resizeMode="contain"
            />
          </View>
        </PagerView>
        <View style={styles.progressDots}>
          {[...Array(totalPages)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentPage === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Pressable onPress={handleSignUp} style={[styles.button, styles.signUpButton]}>
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>
        <Pressable onPress={handleLogin} style={[styles.button, styles.loginButton]}>
          <Text style={[styles.buttonText, { color: '#358B8B' }]}>Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingBottom: height * 0.03,
  },
  welcomeTitle: {
    fontFamily: 'RobotoSerif-Regular',
    fontWeight: '600',
    fontSize: 18,
    color: 'white',
    paddingHorizontal: width * 0.075,
  },
  titleText: {
    fontFamily: 'RobotoSerif-Regular',
    fontWeight: '400',
    fontSize: 36,
    color: 'white',
    paddingHorizontal: width * 0.075,
  },
  middleSection: {
    flex: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  pagerView: {
    width: '100%',
    height: '75%',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleImage: {
    width: '90%',
    aspectRatio: 0.42,
    resizeMode: 'contain',
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: '#CCC',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'rgba(53, 139, 139, 1)',
    width: 15,
    height: 8,
    borderRadius: 50,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.05,
  },
  button: {
    width: '90%',
    maxWidth: 400,
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
  },
  signUpButton: {
    backgroundColor: '#FB902E',
    borderColor: '#FB902E',
    borderWidth: 3,
  },
  loginButton: {
    borderColor: '#FB902E',
    borderWidth: 3,
  },
  buttonText: {
    fontFamily: 'Abel-Regular',
    fontSize: 20,
    color: '#fff',
    fontWeight: '400',
  },
});
