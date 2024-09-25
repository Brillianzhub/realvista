import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const InvestmentScreen = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Reference for the Bottom Sheet
  const bottomSheetRef = useRef(null);

  // Snap points for the Bottom Sheet
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const openBottomSheet = () => {
    setIsVisible(true);
    bottomSheetRef.current?.expand(); // Opens the Bottom Sheet to the first snap point
  };

  const closeBottomSheet = () => {
    setIsVisible(false);
    bottomSheetRef.current?.close(); // Closes the Bottom Sheet
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openBottomSheet}>
        <Text>Open Bottom Sheet Modal</Text>
      </TouchableOpacity>

      {/* Bottom Sheet Modal */}
      {isVisible && (
        <BottomSheet
          ref={bottomSheetRef}
          index={-1} // Start with the Bottom Sheet closed
          snapPoints={snapPoints}
          enablePanDownToClose={true} // Enable swipe down to close
          onClose={closeBottomSheet}
        >
          <View style={styles.bottomSheetContent}>
            <Text>This is the content of the bottom sheet modal.</Text>
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
  },
  closeButton: {
    marginTop: 20,
    color: 'blue',
  },
});

export default InvestmentScreen;
