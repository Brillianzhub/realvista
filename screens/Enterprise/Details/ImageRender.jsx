import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    Dimensions,
    StyleSheet,
} from 'react-native';
import Swiper from 'react-native-swiper';


const { width: screenWidth } = Dimensions.get('window');

const ImageRender = ({ images, onDeleteImage }) => {
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [deleteMode, setDeleteMode] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);

    if (!images || images.length === 0) return null;

    const openImageModal = (index) => {
        setSelectedImageIndex(index);
        setImageModalVisible(true);
    };

    const handleLongPress = (item) => {
        setDeleteMode(true);
        setImageToDelete(item.id); 
    };

    const handleDelete = () => {
        onDeleteImage(imageToDelete); // Call the parent's delete function
        setDeleteMode(false);
        setImageToDelete(null);
    };

    const handleUnselect = () => {
        setDeleteMode(false);
        setImageToDelete(null);
    };

    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Images</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {images.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            if (deleteMode) {
                                handleUnselect();
                            } else {
                                openImageModal(index);
                            }
                        }}
                        onLongPress={() => handleLongPress(item)} 
                    >
                        <View
                            style={[
                                styles.imageContainer,
                                deleteMode && imageToDelete === item.id && styles.selectedImageContainer,
                            ]}
                        >
                            <Image
                                source={{ uri: item.file }}
                                style={[
                                    styles.image,
                                    deleteMode && imageToDelete === item.id && styles.selectedImage,
                                ]}
                                resizeMode="cover"
                            />
                            {deleteMode && imageToDelete === item.id && (
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

            {/* Image Modal */}
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
                                    resizeMode="contain"
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
    imageContainer: {
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
    },
    selectedImageContainer: {
        borderWidth: 1.5,
        borderColor: 'gray',
    },
    image: {
        width: (screenWidth - 45) / 3,
        height: (screenWidth - 45) / 3,
        borderRadius: 8,
        marginBottom: 10,
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
        backgroundColor: 'black',
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