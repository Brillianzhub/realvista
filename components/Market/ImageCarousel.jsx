import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Modal } from 'react-native';
import { Image } from 'expo-image';
import PagerView from 'react-native-pager-view';
import { PinchGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const aspectRatio = 1.5;
const carouselImageHeight = screenWidth / aspectRatio;

const ImageCarousel = ({ images }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const pagerRef = useRef(null);

    const scale = useSharedValue(1);

    const handleImagePress = (image) => {
        setSelectedImage(image);
        setModalVisible(true);
    };

    const handlePageSelected = (event) => {
        const index = event.nativeEvent.position;
        setActiveIndex(index);
    };

    // Render carousel item
    const renderCarouselItem = (item, index) => {
        return (
            <View key={index} style={styles.carouselItemContainer}>
                <TouchableOpacity onPress={() => handleImagePress(item)}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.carouselImage}
                        contentFit="cover"
                    />
                </TouchableOpacity>
            </View>
        );
    };

    const renderDots = () => {
        return (
            <View style={styles.dotsContainer}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === activeIndex ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>
        );
    };

    // Animated styles for zoom
    const animatedImageStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const onPinchGestureEvent = (event) => {
        scale.value = withTiming(event.nativeEvent.scale);
    };

    const onPinchGestureEnd = () => {
        scale.value = withTiming(1); // Reset zoom on release
    };

    if (!images || images.length === 0) {
        return (
            <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>No images available</Text>
            </View>
        );
    }

    return (
        <View style={styles.carouselContainer}>
            <PagerView
                ref={pagerRef}
                style={styles.pagerView}
                initialPage={0}
                onPageSelected={handlePageSelected}
            >
                {images.map((item, index) => renderCarouselItem(item, index))}
            </PagerView>

            {renderDots()}

            <Modal
                visible={isModalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                        <TouchableWithoutFeedback>
                            <PinchGestureHandler
                                onGestureEvent={onPinchGestureEvent}
                                onEnded={onPinchGestureEnd}
                            >
                                <Animated.Image
                                    source={{ uri: selectedImage?.image }}
                                    style={[styles.expandedImage, animatedImageStyle]}
                                    resizeMode="contain"
                                />
                            </PinchGestureHandler>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    carouselContainer: {
        alignItems: 'center',
    },
    pagerView: {
        width: screenWidth - 20,
        height: carouselImageHeight,
    },
    carouselItemContainer: {
        width: screenWidth - 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselImage: {
        width: screenWidth - 20,
        height: carouselImageHeight,
        borderRadius: 8,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dot: {
        width: 24,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#358B8B',
    },
    inactiveDot: {
        backgroundColor: '#ccc',
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    placeholderText: {
        fontSize: 16,
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    expandedImage: {
        width: screenWidth * 0.9,
        height: (screenWidth * 0.9) / aspectRatio,
        borderRadius: 8,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 10,
        backgroundColor: '#FB902E',
        borderRadius: 8,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#fff',
    },
});

export default ImageCarousel;