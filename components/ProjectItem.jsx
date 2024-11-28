import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import images from '../constants/images';


const ProjectItem = ({ item, onPress }) => (
    <View style={styles.investmentContainer}>
        <View style={styles.imageContainer}>
            <View style={styles.investmentStatus}>
                {item.images && item.images.length > 0 && item.images[0].image_url ? (
                    <Image
                        source={{ uri: item.images[0].image_url }}
                        style={styles.image}
                    />
                ) : null}
                <View style={styles.textOverlay}>
                    <Text style={styles.text}>Open Investment</Text>
                </View>
            </View>
        </View>
        <View style={{ flex: 1 }}>
            <View>
                <Text style={styles.titleText}>{item.name}</Text>
            </View>
            <View style={{ marginVertical: 10 }}>
                <View style={styles.projectLocation}>
                    <Image
                        source={images.location}
                        resizeMode='cover'
                        style={{ height: 15, width: 15 }}
                    />
                    <Text>{item.location}</Text>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={styles.descriptionText}
                    >
                        {item.description}
                    </Text>
                </View>
            </View>
            <View style={{ marginVertical: 1 }}>
                <Text style={{ fontWeight: 'bold', color: '#252B5C', fontSize: 25 }}>$ {item.cost_per_slot}
                    <Text style={{ fontSize: 15 }}> {item.currency}/slot</Text>
                </Text>
            </View>
            <TouchableOpacity
                onPress={onPress}
                style={styles.viewDetailsBtn}
            >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>View Details</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    investmentContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 20,
        padding: 10,
        backgroundColor: '#e5e2ed',
        marginBottom: 15,
        gap: 10,
    },
    imageContainer: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
    },
    investmentStatus: {
        position: 'relative',
        width: '100%',
    },
    image: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
    },
    textOverlay: {
        position: 'absolute',
        bottom: 30,
        left: 10,
        backgroundColor: '#358B8B',
        padding: 6,
        borderRadius: 5,
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
    titleText: {
        fontWeight: 'bold',
        color: '#252B5C',
        fontSize: 25,
        textAlign: 'left'
    },
    projectLocation: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 6,
        marginVertical: 8
    },
    viewDetailsBtn: {
        backgroundColor: '#FB902E',
        padding: 12,
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 20
    }
});

export default ProjectItem;
