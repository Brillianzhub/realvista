import { StyleSheet, Text, View, TouchableOpacity, Image, Linking, ScrollView } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import images from '../constants/images';
import SocialMediaHandle from '../components/SocialMediaHandle';

const NavigationView = () => {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Logo */}
                <View style={styles.logoView}>
                    <Image
                        source={images.logo}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Menu Items */}
                <TouchableOpacity
                    onPress={() => router.push('Manage')}
                    style={styles.menuItem}
                >
                    <Image
                        source={images.manage}
                        style={styles.menuImg}
                    />
                    <Text style={styles.menuText}>Manage Properties</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('General')}
                    style={styles.menuItem}
                >
                    <Image
                        source={images.profile}
                        style={styles.menuImg}
                    />
                    <Text style={styles.menuText}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('Bookmarks')}
                    style={styles.menuItem}
                >
                    <Image
                        source={images.wishList}
                        style={styles.menuImg}
                    />
                    <Text style={styles.menuText}>Favorite Collections</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        Linking.openURL('https://www.realvistaproperties.com/frequently-asked-questions')
                    }
                    style={styles.menuItem}
                >
                    <Image
                        source={images.faq}
                        style={styles.menuImg}
                    />
                    <Text style={styles.menuText}>FAQ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => Linking.openURL('mailto:support@realvistaproperties.com')}
                    style={styles.menuItem}
                >
                    <Image
                        source={images.support}
                        style={styles.menuImg}
                    />
                    <Text style={styles.menuText}>Support</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        Linking.openURL('https://wa.me/+2347043065222?text=Hello, I need support!')
                    }
                    style={styles.menuItem}
                >
                    <Image
                        source={images.whatsapp}
                        style={styles.menuImg}
                    />
                    <Text style={styles.menuText}>WhatsApp Support</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        Linking.openURL('https://www.realvistaproperties.com/privacy-policy')
                    }
                    style={styles.menuItem}
                >
                    <Image
                        source={images.privacyPolicy}
                        style={styles.menuImg}
                    />
                    <Text style={styles.menuText}>Privacy Policy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        Linking.openURL('https://www.realvistaproperties.com/terms-of-use')
                    }
                    style={styles.menuItem}
                >
                    <Image
                        source={images.termsUse}
                        style={styles.menuImg}
                    />
                    <Text style={styles.menuText}>Terms of Use</Text>
                </TouchableOpacity>

                {/* Social Media Handles */}
                <SocialMediaHandle />
            </ScrollView>
        </View>
    );
};

export default NavigationView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Center content vertically
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1, // Ensures the ScrollView can scroll
        justifyContent: 'center', // Center content vertically inside ScrollView
        padding: 20,
    },
    logoView: {
        alignItems: 'center', // Center the logo horizontally
        marginBottom: 20,
    },
    logo: {
        width: 214,
        height: 48,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        gap: 10,
    },
    menuText: {
        fontSize: 18,
        color: '#358B8B',
    },
    menuImg: {
        height: 24,
        width: 24,
    },
});