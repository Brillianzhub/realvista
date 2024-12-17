// import { StyleSheet, Text, TouchableOpacity, View, FlatList, Dimensions } from 'react-native';
// import React from 'react';
// import { useNavigation } from 'expo-router';

// const EnterpriseHomeScreen = () => {
//     const navigation = useNavigation();
//     const userGroups = [
//         { id: 1, name: 'Group A' },
//         { id: 2, name: 'Group B' },
//     ]

//     const { width } = Dimensions.get('window');

//     const slides = [
//         {
//             id: '1',
//             title: 'Welcome to our Mutual Investment Platform! 🌟',
//             description:
//                 'Discover the power of group investments—join forces with others to co-invest in high-value properties.',
//             image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+1', // Replace with your custom image
//         },
//         {
//             id: '2',
//             title: 'Co-Invest in Properties',
//             description:
//                 'Share expenses and enjoy collective dividends while building your real estate portfolio.',
//             image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+2', // Replace with your custom image
//         },
//         {
//             id: '3',
//             title: 'Achieve Financial Goals Together',
//             description:
//                 'Group funding opens doors to countless opportunities in the real estate market.',
//             image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+3', // Replace with your custom image
//         },
//         {
//             id: '4',
//             title: 'Start Your Journey Today!',
//             description:
//                 'Join a group or create one to take the first step toward shared success.',
//             image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+4', // Replace with your custom image
//         },
//     ];

//     const StoryFeature = () => {
//         const navigation = useNavigation();
//         const flatListRef = useRef(null);

//         return (
//             <View style={styles.container}>
//                 <FlatList
//                     ref={flatListRef}
//                     data={slides}
//                     keyExtractor={(item) => item.id}
//                     horizontal
//                     pagingEnabled
//                     showsHorizontalScrollIndicator={false}
//                     renderItem={({ item }) => (
//                         <View style={styles.slide}>
//                             <Image source={{ uri: item.image }} style={styles.image} />
//                             <Text style={styles.title}>{item.title}</Text>
//                             <Text style={styles.description}>{item.description}</Text>
//                         </View>
//                     )}
//                 />
//                 <TouchableOpacity
//                     style={styles.actionButton}
//                     onPress={() => navigation.navigate('CreateGroup')}
//                 >
//                     <Text style={styles.actionButtonText}>Create a Group</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     };

//     return (
//         <View style={styles.container}>
//             {/* Introductory Note */}
//             <View style={styles.introContainer}>
//                 <Text style={styles.introText}>
//                     Welcome to our Mutual Investment Platform! 🌟
//                 </Text>
//                 <Text style={styles.description}>
//                     Discover the power of group investments—join forces with others to co-invest in
//                     high-value properties, share expenses, and enjoy collective dividends. Whether you're
//                     looking to diversify your portfolio or enter the real estate market, group funding
//                     opens doors to countless opportunities.
//                 </Text>
//             </View>

//             {/* Group List or Contact/Creation Options */}
//             <View style={styles.groupContainer}>
//                 {userGroups.length > 0 ? (
//                     <>
//                         <Text style={styles.sectionHeader}>Your Groups</Text>
//                         <FlatList
//                             data={userGroups}
//                             keyExtractor={(item) => item.id.toString()}
//                             renderItem={({ item }) => (
//                                 <TouchableOpacity
//                                     style={styles.groupItem}
//                                     onPress={() => navigation.navigate('GroupDashboard', { groupId: item.id })}
//                                 >
//                                     <Text style={styles.groupName}>{item.name}</Text>
//                                 </TouchableOpacity>
//                             )}
//                         />
//                     </>
//                 ) : (
//                     <View style={styles.noGroupContainer}>
//                         <Text style={styles.noGroupText}>
//                             You don't belong to any groups yet. Explore group investment plans and
//                             learn how you can start your journey toward shared success.
//                         </Text>
//                         <TouchableOpacity
//                             style={styles.contactButton}
//                             onPress={() => navigation.navigate('Contact')}
//                         >
//                             <Text style={styles.contactButtonText}>Contact Us to Learn More</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={styles.createGroupButton}
//                             onPress={() => navigation.navigate('CreateGroup')}
//                         >
//                             <Text style={styles.createGroupButtonText}>Create a Group</Text>
//                         </TouchableOpacity>
//                     </View>
//                 )}
//             </View>
//         </View>
//     );
// };

// export default EnterpriseHomeScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#f5f5f5',
//     },
//     introContainer: {
//         marginBottom: 20,
//         padding: 15,
//         backgroundColor: '#e6f7ff',
//         borderRadius: 8,
//     },
//     introText: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#0056b3',
//         marginBottom: 8,
//     },
//     description: {
//         fontSize: 16,
//         color: '#333',
//     },
//     groupContainer: {
//         flex: 1,
//     },
//     sectionHeader: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         color: '#222',
//     },
//     groupItem: {
//         padding: 15,
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         marginBottom: 10,
//         borderWidth: 1,
//         borderColor: '#ddd',
//     },
//     groupName: {
//         fontSize: 16,
//         color: '#333',
//     },
//     noGroupContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: 20,
//     },
//     noGroupText: {
//         fontSize: 16,
//         color: '#555',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     contactButton: {
//         backgroundColor: '#007bff',
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 5,
//         marginBottom: 10,
//     },
//     contactButtonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     createGroupButton: {
//         backgroundColor: '#28a745',
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 5,
//     },
//     createGroupButtonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });


// import React, { useRef } from 'react';
// import {
//     StyleSheet,
//     Text,
//     View,
//     ImageBackground,
//     FlatList,
//     Dimensions,
//     TouchableOpacity,
// } from 'react-native';
// import { useNavigation } from 'expo-router';

// const { width, height } = Dimensions.get('window');

// const slides = [
//     {
//         id: '1',
//         title: 'Welcome to our Mutual Investment Platform! 🌟',
//         description:
//             'Discover the power of group investments—join forces with others to co-invest in high-value properties.',
//         image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+1', // Replace with your custom image
//     },
//     {
//         id: '2',
//         title: 'Co-Invest in Properties',
//         description:
//             'Share expenses and enjoy collective dividends while building your real estate portfolio.',
//         image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+2', // Replace with your custom image
//     },
//     {
//         id: '3',
//         title: 'Achieve Financial Goals Together',
//         description:
//             'Group funding opens doors to countless opportunities in the real estate market.',
//         image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+3', // Replace with your custom image
//     },
//     {
//         id: '4',
//         title: 'Start Your Journey Today!',
//         description:
//             'Join a group or create one to take the first step toward shared success.',
//         image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+4', // Replace with your custom image
//     },
// ];

// const StoryFeature = () => {
//     const navigation = useNavigation();
//     const flatListRef = useRef(null);

//     return (
//         <View style={styles.container}>
//             <FlatList
//                 ref={flatListRef}
//                 data={slides}
//                 keyExtractor={(item) => item.id}
//                 horizontal
//                 pagingEnabled
//                 showsHorizontalScrollIndicator={false}
//                 renderItem={({ item }) => (
//                     <ImageBackground source={{ uri: item.image }} style={styles.slide}>
//                         <View style={styles.overlay}>
//                             <Text style={styles.title}>{item.title}</Text>
//                             <Text style={styles.description}>{item.description}</Text>
//                         </View>
//                     </ImageBackground>
//                 )}
//             />
//             <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={() => navigation.navigate('CreateGroup')}
//             >
//                 <Text style={styles.actionButtonText}>Create a Group</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

// export default StoryFeature;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f5f5f5',
//     },
//     slide: {
//         width,
//         height: height * 0.3, 
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     overlay: {
//         width: '100%',
//         height: '100%',
//         backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark semi-transparent overlay for better text readability
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#fff',
//         textAlign: 'center',
//         marginBottom: 10,
//     },
//     description: {
//         fontSize: 16,
//         color: '#fff',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     actionButton: {
//         backgroundColor: '#007bff',
//         paddingVertical: 12,
//         paddingHorizontal: 20,
//         borderRadius: 5,
//         alignSelf: 'center',
//         marginTop: 20,
//     },
//     actionButtonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });


import React, { useRef, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    FlatList,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from 'expo-router';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Welcome to our Mutual Investment Platform! 🌟',
        description:
            'Discover the power of group investments—join forces with others to co-invest in high-value properties.',
        image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+1', // Replace with your custom image
    },
    {
        id: '2',
        title: 'Co-Invest in Properties',
        description:
            'Share expenses and enjoy collective dividends while building your real estate portfolio.',
        image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+2', // Replace with your custom image
    },
    {
        id: '3',
        title: 'Achieve Financial Goals Together',
        description:
            'Group funding opens doors to countless opportunities in the real estate market.',
        image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+3', // Replace with your custom image
    },
    {
        id: '4',
        title: 'Start Your Journey Today!',
        description:
            'Join a group or create one to take the first step toward shared success.',
        image: 'https://via.placeholder.com/300x200.png?text=Investment+Slide+4', // Replace with your custom image
    },
];

const StoryFeature = () => {
    const navigation = useNavigation();
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === slides.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval); // Cleanup on unmount
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
        <View style={styles.container}>
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
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('CreateGroup')}
            >
                <Text style={styles.actionButtonText}>Create a Group</Text>
            </TouchableOpacity>
        </View>
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
});

