import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MarketDocumentUploader = ({ propertyId }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    const selectDocuments = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
            multiple: true,
        });

        if (result.type !== 'cancel') {
            const allowedTypes = ['pdf', 'png', 'jpg', 'jpeg', 'mp3', 'mp4'];
            const maxFileSize = 10 * 1024 * 1024;

            const selectedDocuments = result.assets
                .filter(asset => {
                    const name = asset.name || `file_${Date.now()}`;
                    const extension = name.split('.').pop().toLowerCase();

                    if (!allowedTypes.includes(extension)) {
                        alert(`The file "${name}" is not allowed. Only PDF, JPG, JPEG, MP3, and MP4 files are supported.`);
                        return false;
                    }

                    if ((asset.size || 0) > maxFileSize) {
                        alert(`The file "${name}" exceeds the 10MB size limit.`);
                        return false;
                    }

                    return true;
                })
                .map(asset => {
                    const uri = asset.uri;
                    const name = asset.name || `file_${Date.now()}`;
                    const extension = name.split('.').pop().toLowerCase();

                    let type = 'application/octet-stream';
                    if (['jpg', 'jpeg', 'png'].includes(extension)) {
                        type = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
                    } else if (extension === 'pdf') {
                        type = 'application/pdf';
                    } else if (extension === 'mp3') {
                        type = 'audio/mpeg';
                    } else if (extension === 'mp4') {
                        type = 'video/mp4';
                    }

                    const fileName = name.includes('.') ? name : `${name}.${extension}`;

                    return {
                        uri,
                        type,
                        name: fileName,
                    };
                });

            setDocuments([...documents, ...selectedDocuments]);
        }
    };



    const removeDocument = (index) => {
        setDocuments(documents.filter((_, i) => i !== index));
    };

    const uploadDocuments = async () => {
        if (documents.length === 0) {
            alert('Please select documents to upload.');
            return;
        }

        if (!propertyId) {
            alert('Property ID is required to upload documents.');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('property', propertyId);

        documents.forEach((file, index) => {
            const fileData = {
                uri: file.uri,
                type: file.type,
                name: file.name,
            };
            formData.append('file', fileData);
        });

        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                alert('User authentication token not found. Please log in.');
                setLoading(false);
                return;
            }

            const response = await axios.post(
                'https://realvistamanagement.com/market/upload-file-market/',
                formData,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            alert('Documents uploaded successfully.');
            setDocuments([]);
        } catch (error) {
            if (error.response) {
                console.error('Server Error:', error.response.data);
                alert(`Upload failed: ${error.response.data.message || 'Server error'}`);
            } else if (error.request) {
                console.error('No response from server:', error.request);
                alert('No response from the server. Please check your network.');
            } else {
                console.error('Error:', error.message);
                alert(`Upload failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.button, { borderColor: '#FB902E', borderWidth: 1.5 }]} onPress={selectDocuments}>
                <Text style={[styles.buttonText, { color: '#FB902E' }]}>Select File</Text>
            </TouchableOpacity>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                Maximum file size is 10MB. Ensure files are named accordingly, as these names will be used to list the files.
                This applies to documents and not necessarily to images. Supported file types: PDF, JPG, JPEG, MP3, and MP4.
            </Text>

            {documents.length > 0 && (
                <FlatList
                    data={documents}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.fileItem}>
                            <Text style={styles.fileName}>{item.name}</Text>
                            <TouchableOpacity style={styles.removeButton} onPress={() => removeDocument(index)}>
                                <Text style={styles.removeButtonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#FB902E' }, loading && styles.disabledButton]}
                onPress={uploadDocuments}
                disabled={loading || documents.length === 0}
            >
                <Text style={styles.buttonText}>{loading ? 'Uploading...' : 'Upload Files'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '400',
    },
    disabledButton: {
        backgroundColor: '#B0C4DE',
    },
    fileItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        marginBottom: 8,
    },
    fileName: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    removeButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#b2acac',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    removeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default MarketDocumentUploader;
