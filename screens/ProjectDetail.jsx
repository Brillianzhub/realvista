import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProjectImageCarousel from '../components/ProjectImageCarousel';


const ProjectDetail = ({ route }) => {
    const { projectId } = route.params;
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchProjectDetail = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');

                if (!token) {
                    console.error("No authentication token found");
                    return;
                }
                const response = await axios.get(`https://brillianzhub.eu.pythonanywhere.com/projects/${projectId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setProject(response.data);
            } catch (error) {
                console.error("Unable to fetch project details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetail();
    }, [projectId]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!project) {
        return <Text>Project not found</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.projectTitle}>{project.name}</Text>
            <ProjectImageCarousel images={project.images} />
            <Text style={styles.projectDescription}>{project.description}</Text>
            <Text style={styles.projectInfo}>Budget: ${project.budget}</Text>
            <Text style={styles.projectInfo}>Status: {project.status}</Text>
            <Text style={styles.projectInfo}>Location: {project.location}</Text>
            <Text style={styles.projectInfo}>Type: {project.type}</Text>
            <Text style={styles.projectInfo}>Number of Slots: {project.slots}</Text>
            <Text style={styles.projectInfo}>Cost per Slot: ${project.cost_per_slot}</Text>
        </ScrollView>
    );
};

export default ProjectDetail;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    projectTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    projectImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 15,
    },
    projectDescription: {
        fontSize: 16,
        marginBottom: 10,
    },
    projectInfo: {
        fontSize: 16,
        marginBottom: 5,
    },
    carouselContainer: {
        alignItems: 'center',
    },
    carouselImage: {
        // width: screenWidth,
        height: 250,
        resizeMode: 'cover',
    },
    dotContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
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
        backgroundColor: '#808080',
    },
});
