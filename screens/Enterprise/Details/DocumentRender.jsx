import React from 'react';
import { TouchableOpacity, Text, Linking, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo for icons

const DocumentRender = ({ documents, onDeleteDocument }) => {
    if (!documents || documents.length === 0) return null;

    // Function to truncate long text
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Documents</Text>
            {documents.map((item, index) => (
                <View
                    key={index}
                    style={styles.documentContainer}
                >
                    <TouchableOpacity
                        style={styles.documentNameContainer}
                        onPress={() => Linking.openURL(item.file)}
                    >
                        <Text style={styles.documentName}>
                            {truncateText(item.name || 'Unnamed Document', 30)} {/* Adjust maxLength as needed */}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onDeleteDocument(item.id)} // Call onDeleteDocument with the document ID
                        style={styles.deleteButton}
                    >
                        <Ionicons name="trash-outline" size={20} color="red" />
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    documentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    documentNameContainer: {
        flex: 1,
    },
    documentName: {
        color: '#007bff',
    },
    deleteButton: {
        marginLeft: 10,
    },
});

export default DocumentRender;