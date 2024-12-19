import React, { useRef, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';


const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Welcome to our Mutual Investment Platform! 🌟',
        description:
            'Discover the power of group investments—join forces with others to co-invest in high-value properties.',
        image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+1',
    },
    {
        id: '2',
        title: 'Co-Invest in Properties',
        description:
            'Share expenses and enjoy collective dividends while building your real estate portfolio.',
        image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+2',
    },
    {
        id: '3',
        title: 'Achieve Financial Goals Together',
        description:
            'Group funding opens doors to countless opportunities in the real estate market.',
        image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+3',
    },
    {
        id: '4',
        title: 'Start Your Journey Today!',
        description:
            'Join a group or create one to take the first step toward shared success.',
        image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+4',
    },
];

const StoryFeature = () => {
    const navigation = useNavigation();
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { user } = useGlobalContext();
    const { groups } = user;


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === slides.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index: currentIndex,
                animated: true,
            });
        }
    }, [currentIndex]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 20 }}
        >
            <View style={{ height: height * 0.3 }}>
                <FlatList
                    ref={flatListRef}
                    data={slides}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <ImageBackground source={{ uri: item.image }} style={styles.slide}>
                            <View style={styles.overlay}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </ImageBackground>
                    )}
                />
            </View>
            <View style={styles.groupContainer}>
                {/* <Text style={styles.sectionHeader}>Your Groups</Text> */}
                {groups?.map((item) => (
                    <TouchableOpacity
                        key={item.group.id}
                        style={styles.groupItem}
                        onPress={() => navigation.navigate('GroupDashboard', { groupId: item.group.id, role: item.role })}
                    >
                        <Text style={styles.groupName}>{item.group.name}</Text>
                        <Text style={styles.groupDescription}>{item.group.description}</Text>
                        {/* <Text style={styles.groupRole}>Role: {item.role}</Text> */}
                    </TouchableOpacity>
                ))}

                <View style={styles.noGroupContainer}>
                    <Text style={styles.noGroupText}>
                        You don't belong to any groups yet. Explore group investment plans and
                        learn how you can start your journey toward shared success.
                    </Text>
                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={() => navigation.navigate('Contact')}
                    >
                        <Text style={styles.contactButtonText}>Contact Us to Learn More</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.createGroupButton}
                        onPress={() => navigation.navigate('CreateEnterprise')}
                    >
                        <Text style={styles.createGroupButtonText}>Create a Group</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default StoryFeature;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    slide: {
        width,
        height: height * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    overlay: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 8
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 20,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    groupContainer: {
        padding: 16
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#222',
    },
    groupItem: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },

    groupName: {
        fontSize: 16,
        color: '#333',
    },
    noGroupContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    noGroupText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    contactButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    createGroupButton: {
        backgroundColor: '#FB902E',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    createGroupButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

});

