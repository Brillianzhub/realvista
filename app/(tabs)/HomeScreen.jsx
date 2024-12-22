import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React, { useCallback } from 'react';
import images from '../../constants/images';
import { router } from 'expo-router';
import { usePushNotifications } from '@/usePushNotifications';
import { useNavigation } from '@react-navigation/native';

const HomeMenu = () => {
    const navigation = useNavigation();
    const { enableNotifications, disableNotifications, getNotificationStatus } = usePushNotifications();

    const menuItems = [
        { id: 1, title: 'Portfolio', image: images.portfolio, route: 'Portfolio' },
        { id: 2, title: 'Investment', image: images.invest, route: 'Investment' },
        { id: 3, title: 'Market', image: images.market, route: 'Market' },
        { id: 4, title: 'Mutual Investment', image: images.team, route: 'Enterprise' },
        { id: 5, title: 'Learn', image: images.learn, route: 'Learn' },
        { id: 6, title: 'Calculator', image: images.calculator, route: 'Analysis' },
        { id: 7, title: 'Manager', image: images.manage, route: 'Manage' },
        { id: 8, title: 'Trends', image: images.trends },
        { id: 9, title: 'Settings', image: images.trends },

    ];

    const handlePress = useCallback(
        (route) => {
            if (route) {
                ['Learn', 'Manage', 'Enterprise', 'Analysis'].includes(route)
                    ? router.replace(route)
                    : navigation.navigate(route);
            } else {
                alert('This feature is not available yet!');
            }
        },
        [navigation, router]
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.row}>
                {menuItems.slice(0, 3).map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.menuCard, styles.rowStyle1]}
                        onPress={() => handlePress(item.route)}
                    >
                        <Image source={item.image} style={styles.image} />
                        <Text style={styles.menuText}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={[styles.row, styles.rowStyle2]}>
                {menuItems.slice(3, 6).map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.menuCard, styles.rowStyle2]}
                        onPress={() => handlePress(item.route)}
                    >
                        <Image source={item.image} style={styles.image} />
                        <Text style={styles.menuText}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={[styles.row, styles.rowStyle3]}>
                {menuItems.slice(6).map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.menuCard, styles.rowStyle3]}
                        onPress={() => handlePress(item.route)}
                    >
                        <Image source={item.image} style={styles.image} />
                        <Text style={styles.menuText}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
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
        width: 120,
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
