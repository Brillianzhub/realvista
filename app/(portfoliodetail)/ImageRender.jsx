import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Dimensions,
    StyleSheet,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { Image } from 'expo-image';


const { width: screenWidth } = Dimensions.get('window');

const ImageRender = ({ images, onDeleteImage }) => {
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imageToDelete, setImageToDelete] = useState(null);

    if (!images || images.length === 0) return null;

    const openImageModal = (index) => {
        if (imageToDelete !== null) {
            setImageToDelete(null);
        } else {
            setSelectedImageIndex(index);
            setImageModalVisible(true);
        }
    };

    const handleLongPress = (item) => {
        setImageToDelete(item.id);
    };

    const handleDelete = () => {
        if (imageToDelete !== null) {
            onDeleteImage(imageToDelete);
            setImageToDelete(null);
        }
    };

    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Images</Text>
            <View style={styles.imageGrid}>
                {images.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => openImageModal(index)}
                        onLongPress={() => handleLongPress(item)}
                    >
                        <View
                            style={[
                                styles.imageContainer,
                                imageToDelete === item.id && styles.selectedImageContainer,
                            ]}
                        >
                            <Image
                                source={{ uri: item.file }}
                                style={[
                                    styles.image,
                                    imageToDelete === item.id && styles.selectedImage,
                                ]}
                                contentFit="cover"
                            />
                            {imageToDelete === item.id && (
                                <View style={styles.overlay}>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={handleDelete}
                                    >
                                        <Text style={styles.deleteButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <Modal
                visible={imageModalVisible}
                transparent={true}
                onRequestClose={() => setImageModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Swiper
                        index={selectedImageIndex}
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
                        onPress={() => setImageModalVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    imageContainer: {
        position: 'relative',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10,
    },
    selectedImageContainer: {
        borderWidth: 1.5,
        borderColor: 'gray',
        borderRadius: 8,
    },
    image: {
        width: (screenWidth - 45) / 3,
        height: (screenWidth - 45) / 3,
        borderRadius: 8,
    },
    selectedImage: {
        opacity: 0.6,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 12,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
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

export default ImageRender;
