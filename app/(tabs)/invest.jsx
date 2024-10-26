import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import PagerView from 'react-native-pager-view';

const dummyData = [
  {
    id: 1,
    title: '10 Plots of Land',
  },
  {
    id: 2,
    title: 'Hostel Apartment',
  },
  {
    id: 3,
    title: 'Two storey six two bedroom block of flats',
  },
  {
    id: 4,
    title: 'Bungalows for single Family',
  },
  {
    id: 5,
    title: '10 Plots of Land',
  },
  {
    id: 6,
    title: 'Hostel Apartment',
  },
  {
    id: 7,
    title: 'Two storey six two bedroom block of flats',
  },
  {
    id: 8,
    title: 'Bungalows for single Family',
  },
];


const InvestmentScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const bottomSheetRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const openBottomSheet = () => {
    setIsVisible(true);
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    setIsVisible(false);
    bottomSheetRef.current?.close();
  };

  const handlePageChange = (event) => {
    const pageIndex = event.nativeEvent.position;
    setCurrentPage(pageIndex);
    Animated.timing(progressAnim, {
      toValue: (pageIndex + 1) / dummyData.length,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openBottomSheet}>
        <Text>Open Bottom Sheet Modal</Text>
      </TouchableOpacity>

      {isVisible && (
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={closeBottomSheet}
        >
          <View style={styles.bottomSheetContent}>
            <View style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBarForeground,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>

            <PagerView
              style={styles.pagerView}
              initialPage={0}
              onPageSelected={handlePageChange}
            >
              {dummyData.map((item) => (
                <View key={item.id} style={styles.page}>
                  <Text style={styles.title}>{item.title}</Text>
                </View>
              ))}
            </PagerView>

            <TouchableOpacity onPress={closeBottomSheet}>
              <Text style={styles.closeButton}>Close Bottom Sheet</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetContent: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  pagerView: {
    height: 200,
    width: '100%',
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    color: 'blue',
  },
  progressBarBackground: {
    height: 5,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 2.5,
    marginBottom: 10,
  },
  progressBarForeground: {
    height: '100%',
    backgroundColor: 'blue',
    borderRadius: 2.5,
  },
});

export default InvestmentScreen;
