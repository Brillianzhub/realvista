import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import images from '../../constants/images';

import { router, useNavigation } from 'expo-router';

const HomeMenu = () => {

    const navigation = useNavigation();


    return (
        <View style={styles.container}>
            <View style={styles.menuItem}>
                <View style={styles.menuGroup}>
                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => navigation.navigate('Portfolio')}
                    >
                        <Image source={images.portfolio} style={styles.image} />
                    </TouchableOpacity>
                    <Text style={styles.menuText}>My Portfolio</Text>
                </View>

                <View style={styles.menuGroup}>
                    <TouchableOpacity style={styles.menuCard}>
                        <Image source={images.invest} style={styles.image} />
                    </TouchableOpacity>
                    <Text style={styles.menuText}>Investment</Text>
                </View>
                <View style={styles.menuGroup}>
                    <TouchableOpacity style={styles.menuCard}>
                        <Image source={images.market} style={styles.image} />
                    </TouchableOpacity>
                    <Text style={styles.menuText}>Market</Text>
                </View>
            </View>
            <View style={styles.menuItem}>
                <View style={styles.menuGroup}>
                    <TouchableOpacity style={styles.menuCard}>
                        <Image source={images.portfolio} style={styles.image} />
                    </TouchableOpacity>
                    <Text style={styles.menuText}>Corporate Account</Text>
                </View>

                <View style={styles.menuGroup}>
                    <TouchableOpacity
                        onPress={() => router.replace('Learn')}
                        style={styles.menuCard}>
                        <Image source={images.invest} style={styles.image} />
                    </TouchableOpacity>
                    <Text style={styles.menuText}>Learn</Text>
                </View>
                <View style={styles.menuGroup}>
                    <TouchableOpacity style={styles.menuCard}>
                        <Image source={images.calculator} style={styles.image} />
                    </TouchableOpacity>
                    <Text style={styles.menuText}>Calculator</Text>
                </View>
            </View>
        </View>
    );
}

export default HomeMenu;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: '100%',
        marginBottom: 10,
        paddingVertical: 10,
        backgroundColor: 'rgba(53, 139, 139, 0.05)',
        borderRadius: 15,

    },
    menuGroup: {
        alignItems: 'center',
        width: '25%',
        marginBottom: 10,

    },
    menuCard: {
        backgroundColor: 'rgba(53, 139, 139, 0.2)',
        borderRadius: 50,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
        width: '70%',
    },

    image: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    menuText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        width: '100%',
    }
});
