import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Linking,
    SafeAreaView,
} from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import images from '../../constants/images';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import PagerView from 'react-native-pager-view';
import { usePushNotifications } from '../../usePushNotifications';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useTheme } from '@/context/ThemeContext';


const ROUTES = {
    PORTFOLIO: 'Portfolio',
    INVESTMENT: 'Investment',
    MARKET: 'Market',
    TRENDS: 'Trends',
    ANALYSIS: 'Analysis',
    LEARN: 'Learn',
    MUTUAL: 'Enterprise',
    MANAGER: 'Manage',
    SETTINGS: 'Settings',
};

const FAQ_URL = 'https://www.realvistaproperties.com/frequently-asked-questions';

const MenuItem = ({ onPress, imageSource, text }) => (
    <TouchableOpacity style={styles.mainMenuItem} onPress={onPress} accessible={true} accessibilityLabel={`Navigate to ${text}`}>
        <Image source={imageSource} style={styles.mainMenuImage} />
        <Text style={styles.menuText}>{text}</Text>
    </TouchableOpacity>
);

const HomeMenu = () => {
    const navigation = useNavigation();
    const [currentPage, setCurrentPage] = useState(0);
    const pagerRef = useRef(null);
    const totalPages = 5;
    const autoSlideInterval = 4000;
    const { user } = useGlobalContext();
    const { theme, toggleTheme, colors } = useTheme();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPage((prevPage) => {
                const nextPage = (prevPage + 1) % totalPages;
                if (pagerRef.current) {
                    pagerRef.current.setPage(nextPage);
                }
                return nextPage;
            });
        }, autoSlideInterval);

        return () => clearInterval(interval);
    }, []);

    const { expoPushToken, notification, enableNotifications, disableNotifications, getNotificationStatus } = usePushNotifications();

    useEffect(() => {
        enableNotifications();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mainMenu}>
                    <MenuItem onPress={() => navigation.navigate(ROUTES.PORTFOLIO)} imageSource={images.portfolio} text="Portfolio" />
                    <MenuItem onPress={() => router.replace(ROUTES.INVESTMENT)} imageSource={images.invest} text="RealInvest" />
                    <MenuItem onPress={() => router.replace(ROUTES.MUTUAL)} imageSource={images.team} text="MutualInvest" />
                </View>

                <View style={styles.auxiliaryMenu}>
                    <View style={styles.menuRow}>
                        <MenuItem onPress={() => navigation.navigate(ROUTES.MARKET)} imageSource={images.market} text="Market" />
                        <MenuItem onPress={() => router.replace(ROUTES.ANALYSIS)} imageSource={images.calculator} text="Calculator" />
                        <MenuItem onPress={() => router.replace(ROUTES.MANAGER)} imageSource={images.manager} text="Manager" />

                    </View>
                    <View style={styles.menuRow}>
                        <MenuItem onPress={() => router.replace(ROUTES.LEARN)} imageSource={images.learn} text="Learn" />
                        <MenuItem onPress={() => router.replace(ROUTES.TRENDS)} imageSource={images.trends} text="Trends" />
                        <MenuItem onPress={() => router.replace(ROUTES.SETTINGS)} imageSource={images.menuSettings} text="Settings" />
                    </View>
                </View>

                <View style={styles.faqSection}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                        Need Help? Check Our{' '}
                        <Text style={styles.link} onPress={() => Linking.openURL(FAQ_URL)}>
                            FAQs
                        </Text>
                    </Text>
                </View>
                <PagerView
                    style={styles.pagerView}
                    initialPage={0}
                    ref={pagerRef}
                    onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
                >
                    <View key="1">
                        <View style={styles.pageImageWrapper}>
                            <Image source={images.carouselOne} style={styles.pageImage} />
                        </View>
                    </View>
                    <View key="2">
                        <View style={styles.pageImageWrapper}>
                            <Image source={images.carouselTwo} style={styles.pageImage} />
                        </View>
                    </View>
                    <View key="3">
                        <View style={styles.pageImageWrapper}>
                            <Image source={images.carouselThree} style={styles.pageImage} />
                        </View>
                    </View>
                    <View key="4">
                        <View style={styles.pageImageWrapper}>
                            <Image source={images.carouselFour} style={styles.pageImage} />
                        </View>
                    </View>
                    <View key="5">
                        <View style={styles.pageImageWrapper}>
                            <Image source={images.carouselFive} style={styles.pageImage} />
                        </View>
                    </View>
                </PagerView>
                <View style={styles.progressDots}>
                    {[...Array(totalPages)].map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentPage === index && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeMenu;


const styles = StyleSheet.create({
    container: {
        padding: 20,

    },
    mainMenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#358B8B0D',
        borderRadius: 12,
    },
    mainMenuItem: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    mainMenuImage: {
        height: 40,
        width: 40,
    },
    menuText: {
        fontSize: 14,
    },
    auxiliaryMenu: {
        padding: 20,
        backgroundColor: '#358B8B0D',
        marginVertical: 15,
        borderRadius: 12,
    },
    menuRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    faqSection: {
        padding: 10,
    },
    link: {
        color: '#FB902E',
        textDecorationLine: 'underline',
    },
    pagerView: {
        height: 200,
        padding: 10,
    },
    pageImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    pageImageWrapper: {
        marginTop: 10,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    progressDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 50,
        backgroundColor: '#CCC',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: 'rgba(53, 139, 139, 1)',
        width: 25,
        height: 8,
        borderRadius: 50,
    },
});
