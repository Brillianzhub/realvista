import React, { useState } from 'react';
import { View, Image, Dimensions, StyleSheet, Text } from 'react-native';
import PagerView from 'react-native-pager-view';

// Define screen width to use in styles
// const { width: screenWidth } = Dimensions.get('window');

const ProjectImageCarousel = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Render an item in the carousel
  const renderItem = (item) => (
    <Image source={{ uri: item.image_url }} style={styles.carouselImage} />
  );

  // If images array is empty or undefined, return a message instead of the carousel
  if (!images || images.length === 0) {
    return (
      <View style={styles.noImagesContainer}>
        <Text>No images available</Text>
      </View>
    );
  }

  return (
    <View style={styles.carouselContainer}>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
      >
        {images.map((item, index) => (
          <View key={index}>
            {renderItem(item)}
          </View>
        ))}
      </PagerView>
      <View style={styles.dotContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default ProjectImageCarousel;

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  pagerView: {
    flex: 1,
    height: 250,
  },
  carouselImage: {
    // width: screenWidth,
    height: 250,
    resizeMode: 'cover',
  },
  dotContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#ffffff',
  },
  inactiveDot: {
    backgroundColor: '#808080',
  },
  noImagesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
  },
});
