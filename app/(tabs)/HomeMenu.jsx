import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React from 'react';
import images from '../../constants/images';
import { router, useNavigation } from 'expo-router';
import { usePushNotifications } from '@/usePushNotifications';


const HomeMenu = () => {
    const navigation = useNavigation();
    const { enableNotifications, disableNotifications, getNotificationStatus } = usePushNotifications();


    const menuItems = [
        { id: 1, title: 'My Portfolio', image: images.portfolio, route: 'Portfolio' },
        { id: 2, title: 'Investment', image: images.invest },
        { id: 3, title: 'Market', image: images.market },
        { id: 4, title: 'Mutual Investment', image: images.team, route: 'Enterprise' },
        { id: 5, title: 'Learn', image: images.learn, route: 'Learn' },
        { id: 6, title: 'Calculator', image: images.calculator },
        { id: 7, title: 'Manage Portfolio', image: images.manage, route: 'Manage' },
        { id: 8, title: 'Settings', image: images.calculator },
        { id: 9, title: 'Help Center', image: images.invest },
        { id: 10, title: 'Feedback', image: images.portfolio },
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* First Row - 3 Items */}
            <View style={styles.row}>
                {menuItems.slice(0, 3).map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.menuCard, styles.rowStyle1]}
                        onPress={() => item.route && (item.route === 'Learn' || 'Manage' || 'Enterprise' ? router.replace(item.route) : navigation.navigate(item.route))}
                    >
                        <Image source={item.image} style={styles.image} />
                        <Text style={styles.menuText}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Second Row - 4 Items */}
            <View style={[styles.row, styles.rowStyle2]}>
                {menuItems.slice(3, 6).map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.menuCard, styles.rowStyle2]}
                        onPress={() => item.route && (item.route === 'Learn' || 'Manage' || 'Enterprise' ? router.replace(item.route) : navigation.navigate(item.route))}
                    >
                        <Image source={item.image} style={styles.image} />
                        <Text style={styles.menuText}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Third Row - 3 Items in a Carousel */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
                {menuItems.slice(6).map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.menuCard, styles.rowStyle3]}
                        onPress={() => item.route && (item.route === 'Learn' || 'Manage' || 'Enterprise' ? router.replace(item.route) : navigation.navigate(item.route))}
                    >
                        <Image source={item.image} style={styles.image} />
                        <Text style={styles.menuText}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.bottomImageContainer}>
                <Image
                    source={require('../../assets/images/project-image.png')}
                    style={styles.bottomImage}
                    resizeMode="contain"
                />
            </View>
        </ScrollView>
    );
};

export default HomeMenu;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    menuCard: {
        backgroundColor: 'rgba(53, 139, 139, 0.2)',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    image: {
        width: 24,
        height: 24,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    menuText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    rowStyle1: {
        // width: '30%', // 3 items per row
    },
    rowStyle2: {
        // width: '100%', 
    },
    rowStyle3: {
        width: 120, // Carousel cards
        marginHorizontal: 10,
    },
    carousel: {
        flexDirection: 'row',
        marginVertical: 20,
    },

    bottomImageContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
        backgroundColor: 'gray',
        borderRadius: 10
    },
    bottomImage: {
        width: '100%',
        height: 200,
    },
});
