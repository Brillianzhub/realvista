import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../constants/images';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';


const ProjectDetail = ({ route }) => {
    const { projectId } = route.params;
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [isDescriptionVisible, setDescriptionVisible] = useState(false);

    const toggleDescriptionVisibility = () => {
        setDescriptionVisible((prev) => !prev);
    };

    const handleInvest = (projectId) => {
        navigation.navigate('InvestmentScreen', { projectId })
    }

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


    const handleNextImage = () => {
        if (project.images && currentImageIndex < project.images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const handlePreviousImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

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
            {project.images && project.images.length > 0 ? (
                <View style={styles.carouselContainer}>
                    <TouchableOpacity
                        onPress={handlePreviousImage}
                        style={[styles.arrowContainer, styles.leftArrow]}
                    >
                        <Image source={images.leftArrow} style={styles.arrowIcon} />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: project.images[currentImageIndex].image_url }}
                        style={styles.projectImage}
                    />
                    <TouchableOpacity
                        onPress={handleNextImage}
                        style={[styles.arrowContainer, styles.rightArrow]}
                    >
                        <Image source={images.rightArrow} style={styles.arrowIcon} />
                    </TouchableOpacity>

                    <View style={styles.dotContainer}>
                        {project.images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    currentImageIndex === index ? styles.activeDot : styles.inactiveDot,
                                ]}
                            />
                        ))}
                    </View>
                </View>

            ) : (
                <Text>No images available</Text>
            )}
            <Text style={styles.projectTitle}>{project.name}</Text>
            <View style={styles.budgetView}>
                <Text style={styles.budget}>Budget: ${project.budget}</Text>
            </View>

            <View>
                <View>
                    <TouchableOpacity
                        onPress={toggleDescriptionVisibility}
                        style={styles.toggleButton}
                    >
                        <Text style={styles.toggleButtonText}>
                            {isDescriptionVisible ? 'Hide Project Description' : 'View Project Description'}
                        </Text>
                        <Ionicons
                            name={isDescriptionVisible ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color="white"
                            style={styles.toggleButtonArrowIcon}
                        />
                    </TouchableOpacity>

                    {isDescriptionVisible && (
                        <Text style={styles.projectDescription}>{project.description}</Text>
                    )}
                </View>

                <View style={styles.projectElement}>
                    <View style={styles.projectIcon}></View>
                    <View>
                        <Text style={[styles.projectCaption]}>Project Location</Text>
                        <Text style={styles.projectInfo}>{project.location}</Text>
                    </View>
                </View>
                <View style={styles.projectElement}>
                    <View style={styles.projectIcon}></View>
                    <View>
                        <Text style={[styles.projectCaption]}>Project Type</Text>
                        <Text style={styles.projectInfo}>{project.type_of_project}</Text>
                    </View>
                </View>
                <View style={styles.projectElement}>
                    <View style={styles.projectIcon}></View>
                    <View>
                        <Text style={[styles.projectCaption]}>Number of Slots</Text>
                        <Text style={styles.projectInfo}>{project.num_slots}</Text>
                    </View>
                </View>
                <View style={styles.projectElement}>
                    <View style={styles.projectIcon}></View>
                    <View>
                        <Text style={[styles.projectCaption]}>Cost/Slot</Text>
                        <Text style={styles.projectInfo}>{project.cost_per_slot}</Text>
                    </View>
                </View>
                <View style={styles.projectElement}>
                    <View style={styles.projectIcon}></View>
                    <View>
                        <Text style={[styles.projectCaption]}>Status</Text>
                        <Text style={styles.projectInfo}>{project.status}</Text>
                    </View>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.investButton}
                        onPress={() => handleInvest(projectId)}
                    >
                        <Text style={styles.investNow}>Invest</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default ProjectDetail;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    projectTitle: {
        fontSize: 24,
        fontWeight: '400',
        marginBottom: 10,
    },
    carouselContainer: {
        position: 'relative',
        width: '100%',
        height: 250,
        marginBottom: 15,
    },
    projectImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    arrowContainer: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -15 }],
        zIndex: 1,
    },
    leftArrow: {
        left: 10,
    },
    rightArrow: {
        right: 10,
    },
    arrowIcon: {
        width: 49,
        height: 49,
    },

    projectElement: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 20,
        marginBottom: 25
    },
    projectIcon: {
        marginRight: 10,
        padding: 10,
        backgroundColor: '#a5c9c9',
        borderRadius: 8,
        borderRadius: 50,
        width: 30,
        height: 30,
    },

    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#FB902E',
        borderRadius: 8,
        marginBottom: 10,
    },
    toggleButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '600',
    },
    toggleButtonArrowIcon: {
        marginLeft: 10,
    },
    projectDescription: {
        fontSize: 16,
        padding: 10,
        marginBottom: 10
    },
    projectCaption: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5
    },
    projectInfo: {
        fontSize: 16,
    },

    dotContainer: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#358B8B',
    },
    inactiveDot: {
        backgroundColor: '#ffffff'
    },
    budgetView: {
        marginBottom: 10,
    },
    budget: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#269690'
    },
    investButton: {
        // margin: 10,
        backgroundColor: '#FB902E',
        borderRadius: 10,
        paddingVertical: 15,
        width: 100,
        alignItems: 'center'
    },
    investNow: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

