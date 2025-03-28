import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Modal } from 'react-native';
import { Image } from 'expo-image';
import PagerView from 'react-native-pager-view';
import { PinchGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import moment from 'moment';
import Swiper from 'react-native-swiper';


const { width: screenWidth } = Dimensions.get('window');
const aspectRatio = 1.5;
const carouselImageHeight = screenWidth / aspectRatio;

const ImageCarousel = ({ images, listed_date }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const pagerRef = useRef(null);

    const handleImagePress = (file) => {
        setSelectedImage(file);
        setModalVisible(true);
    };

    const handlePageSelected = (event) => {
        const index = event.nativeEvent.position;
        setActiveIndex(index);
    };

    const formattedDate = moment(listed_date).fromNow();

    const renderCarouselItem = (item, index) => (
        <View key={index} style={styles.carouselItemContainer}>
            <TouchableOpacity onPress={() => handleImagePress(item)}>
                <Image source={{ uri: item.file }} style={styles.carouselImage} contentFit="cover" />
            </TouchableOpacity>
            <View style={styles.listedDateContainer}>
                <Text style={styles.listedDateText}>Listed - {formattedDate}</Text>
            </View>
        </View>
    );

    const renderDots = () => (
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
                <View style={styles.modalContainer}>
                    <Swiper
                        index={activeIndex}
                        loop={false}
                        showsPagination={true}
                        paginationStyle={{ bottom: 10 }}
                    >
                        {images.map((item, index) => (
                            <View key={index} style={styles.slide}>
                                <Image
                                    source={{ uri: item.file }}
                                    style={styles.fullScreenImage}
                                    contentFit="contain"
                                />
                            </View>
                        ))}
                    </Swiper>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
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
    listedDateContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    listedDateText: {
        color: '#fff',
        fontSize: 14,
    },
    dotsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 5,
        borderRadius: 10,
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
        backgroundColor: '#bbbbbb',
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
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        width: screenWidth,
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'black',
        fontSize: 16,
    },
});

export default ImageCarousel;
