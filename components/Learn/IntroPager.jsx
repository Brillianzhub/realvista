import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import PagerView from 'react-native-pager-view';

const IntroPager = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const pagerRef = useRef(null);
    const totalPages = 3;
    const autoSlideInterval = 3000;

    const images = [
        require('../../assets/images/learn-intro-one.jpg'),
        require('../../assets/images/learn-intro-two.jpg'),
        require('../../assets/images/learn-intro-three.jpg'),
    ];

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

    return (
        <View style={styles.container}>
            <PagerView
                style={styles.pagerView}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                {images.map((image, index) => (
                    <View key={index} style={styles.page}>
                        <Image source={image} style={styles.image} resizeMode="cover" />
                    </View>
                ))}
            </PagerView>

            <View style={styles.progressDots}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentPage === index && styles.activeDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        position: 'relative',
    },
    pagerView: {
        height: 180,
        borderRadius: 10,
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    progressDots: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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
        width: 20,
        height: 10,
        borderRadius: 50,
    },
});

export default IntroPager;
