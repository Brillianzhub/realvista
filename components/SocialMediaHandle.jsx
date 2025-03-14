import { StyleSheet, View, Linking, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const SocialMediaHandle = () => {
    const socialMediaLinks = {
        facebook: 'https://www.facebook.com/share/1FaQPGrXEN/',
        twitter: 'https://x.com/Realvista_NG?t=4wyone_-O3TiMPEgw9Gw-w&s=09',
        linkedin: 'https://www.linkedin.com/company/realvista-ng/',
        instagram: 'https://www.instagram.com/realvista_ng?igsh=MXVtazk2aWV5Mzl1ZA=='
    };

    const handlePress = (url) => {
        Linking.openURL(url).catch((err) =>
            console.error('Failed to open URL:', err)
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => handlePress(socialMediaLinks.facebook)}
                style={styles.iconContainer}
            >
                <Icon name="facebook" size={30} color="#358B8B" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handlePress(socialMediaLinks.twitter)}
                style={styles.iconContainer}
            >
                <Icon name="twitter" size={30} color="#358B8B" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handlePress(socialMediaLinks.linkedin)}
                style={styles.iconContainer}
            >
                <Icon name="linkedin" size={30} color="#358B8B" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handlePress(socialMediaLinks.instagram)}
                style={styles.iconContainer}
            >
                <Icon name="instagram" size={30} color="#358B8B" />
            </TouchableOpacity>
        </View>
    );
};

export default SocialMediaHandle;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    iconContainer: {
        marginHorizontal: 0,
    },
});