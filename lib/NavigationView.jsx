import { StyleSheet, Text, View, TouchableOpacity, Image, Linking } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import images from '../constants/images';


const NavigationView = () => {

    const navigateTo = (route) => {
        router.replace(route);
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoView}>
                <Image
                    source={images.logo}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <TouchableOpacity
                onPress={() => router.push('/manage_property')}
                style={styles.menuItem}
            >
                <Image
                    source={images.manage}
                    style={styles.menuImg}
                />
                <Text style={styles.menuText}>Manage Properties</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push('/profile')}
                style={styles.menuItem}
            >
                <Image
                    source={images.profile}
                    style={styles.menuImg}
                />
                <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push('/settings')}
                style={styles.menuItem}
            >
                <Image
                    source={images.settings}
                    style={styles.menuImg}
                />
                <Text style={styles.menuText}>Settings</Text>
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
                    Linking.openURL('https://wa.me/+4915904976605?text=Hello, I need support!')
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

        </View>
    );
};

export default NavigationView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    logoView: {
        marginBottom: 20
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
        gap: 10
    },
    menuText: {
        fontSize: 18,
        color: '#358B8B'
    },
    menuImg: {
        height: 24,
        width: 24
    }
});
