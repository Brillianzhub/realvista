import React, { useState } from 'react';
import { View, Alert, Text } from 'react-native';
import DocumentRender from './DocumentRender';
import ImageRender from './ImageRender';
import VideoRender from './VideoRender';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FileRenderer = ({ files }) => {
    const [categorizedFiles, setCategorizedFiles] = useState({
        documents: files.documents || [],
        images: files.images || [],
        videos: files.videos || [],
    });

    if (!files || Object.values(files).every(arr => arr.length === 0)) return null;

    const handleDelete = async (fileId, fileType) => {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken?.trim()) {
            Alert.alert('Error', 'Authentication token is missing or invalid.');
            return;
        }

        Alert.alert(
            'Delete File',
            'Are you sure you want to delete this file?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            const response = await fetch(
                                `https://www.realvistamanagement.com/portfolio/delete-file/${fileId}/`,
                                {
                                    method: 'DELETE',
                                    headers: {
                                        Authorization: `Token ${authToken}`,
                                    },
                                },
                            );

                            if (!response.ok) {
                                throw new Error('Failed to delete the file.');
                            }

                            setCategorizedFiles((prev) => ({
                                ...prev,
                                [fileType]: prev[fileType].filter((item) => item.id !== fileId),
                            }));

                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete the file. Please try again.');
                            console.error('Delete error:', error);
                        }
                    },
                },
            ],
        );
    };

    return (
        <View style={{ marginVertical: 10 }}>
            <DocumentRender
                documents={categorizedFiles.documents}
                onDeleteDocument={(fileId) => handleDelete(fileId, 'documents')}
            />
            <ImageRender
                images={categorizedFiles.images}
                onDeleteImage={(fileId) => handleDelete(fileId, 'images')}
            />
            <VideoRender
                videos={categorizedFiles.videos}
                onDeleteVideo={(fileId) => handleDelete(fileId, 'videos')}
            />
        </View>
    );
};

export default FileRenderer;
