import React from 'react';
import { View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import { Video } from 'expo-av';

const FileRenderer = ({ files }) => {
    if (!files) return null;

    return (
        <View>
            {/* Render Documents */}
            {files.documents?.length > 0 && (
                <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Documents</Text>
                    {files.documents.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{
                                padding: 10,
                                backgroundColor: '#f0f0f0',
                                marginBottom: 5,
                                borderRadius: 5,
                            }}
                            onPress={() => Linking.openURL(item.file)}
                        >
                            <Text style={{ color: '#007bff' }}>{item.name || 'Unnamed Document'}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Render Images */}
            {files.images?.length > 0 && (
                <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Images</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {files.images.map((item, index) => (
                            <Image
                                key={index}
                                source={{ uri: item.file }}
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 5,
                                    marginRight: 10,
                                    marginBottom: 10,
                                }}
                                resizeMode="cover"
                            />
                        ))}
                    </View>
                </View>
            )}

            {/* Render Videos */}
            {files.videos?.length > 0 && (
                <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Videos</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {files.videos.map((item, index) => (
                            <Video
                                key={index}
                                source={{ uri: item.file }}
                                style={{
                                    width: 150,
                                    height: 100,
                                    borderRadius: 5,
                                    marginRight: 10,
                                    marginBottom: 10,
                                }}
                                useNativeControls
                                resizeMode="cover"
                            />
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};

export default FileRenderer;
