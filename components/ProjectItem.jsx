import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const ProjectItem = ({ item }) => (
    <TouchableOpacity style={styles.projectItem}>
        <View style={styles.projectInfo}>
            <Text style={styles.projectName}>{item.name}</Text>
            <View style={styles.imageAndDetailsContainer}>
                <View style={styles.projectImageContainer}>
                    {item.images && item.images.length > 0 && item.images[0].image_url ? (
                        <Image
                            source={{ uri: item.images[0].image_url }}
                            style={styles.projectImage}
                        />
                    ) : null}
                </View>

                <View style={styles.projectDetails}>
                    <Text style={styles.projectBudget}>BUDGET: ${item.budget}</Text>
                    <Text style={styles.projectStatus}>STATUS: {item.status}</Text>
                    <Text style={styles.projectSlots}>SLOTS AVAILABLE: {item.num_slots}</Text>
                </View>
            </View>
            <Text style={styles.projectDescription} numberOfLines={3} ellipsizeMode="tail">{item.description}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    projectItem: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
    },
    projectInfo: {
        marginBottom: 10,
    },
    projectName: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#358B8B',
        marginBottom: 10,
    },
    projectDescription: {
        fontSize: 16,
        color: '#777',
        marginTop: 5,
    },
    imageAndDetailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    projectImageContainer: {
        marginRight: 10,
        borderRadius: 5,
        overflow: 'hidden',
        height: 80,
        width: 80,
    },
    projectImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    projectDetails: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    projectBudget: {
        fontSize: 20,
        color: '#358B8B',
        fontWeight: '500',
    },
    projectStatus: {
        fontSize: 20,
        color: '#FB902E',
        marginTop: 5,
        fontWeight: '500',
        textTransform: 'uppercase'
    },
});

export default ProjectItem;
