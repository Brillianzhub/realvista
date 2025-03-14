import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

const VideoRender = ({ videos, role, onDeleteVideo }) => {
    const [deleteMode, setDeleteMode] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState(null);

    if (!videos || videos.length === 0) return null;

    const handleLongPress = (item) => {
        setDeleteMode(true);
        setVideoToDelete(item.id);
    };

    const handleDelete = () => {
        onDeleteVideo(videoToDelete);
        setDeleteMode(false);
        setVideoToDelete(null);
    };

    const handleUnselect = () => {
        setDeleteMode(false);
        setVideoToDelete(null);
    };

    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Videos</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {videos.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            if (deleteMode && role !== 'MEMBER') {
                                handleUnselect();
                            }
                        }}
                        onLongPress={() => {
                            if (role !== 'MEMBER') {
                                handleLongPress(item);
                            }
                        }}
                    >
                        <View
                            style={[
                                styles.videoContainer,
                                deleteMode && role !== 'MEMBER' && videoToDelete === item.id && styles.selectedVideoContainer,
                            ]}
                        >
                            <Video
                                source={{ uri: item.file }}
                                style={[
                                    styles.video,
                                    deleteMode && role !== 'MEMBER' && videoToDelete === item.id && styles.selectedVideo,
                                ]}
                                useNativeControls
                                resizeMode="cover"
                            />
                            {deleteMode && role !== 'MEMBER' && videoToDelete === item.id && (
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

        </View>
    );
};

const styles = StyleSheet.create({
    videoContainer: {
        position: 'relative',
        borderRadius: 5,
        overflow: 'hidden',
        marginRight: 10,
        marginBottom: 10,
    },
    selectedVideoContainer: {
        borderWidth: 1.5,
        borderColor: 'gray',
        borderRadius: 8,
    },
    video: {
        width: 150,
        height: 100,
        borderRadius: 8,
    },
    selectedVideo: {
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
});

export default VideoRender;