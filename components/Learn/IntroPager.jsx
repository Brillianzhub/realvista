import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

const IntroPager = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const pagerRef = useRef(null);
    const totalPages = 3;
    const autoSlideInterval = 3000;

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
                <View key="1" style={[styles.page, { backgroundColor: 'rgba(53, 139, 139, 0.2)' }]}>
                    <Text style={styles.pageText}>
                        Learn the fundamentals of investment and real estate portfolio management.
                    </Text>
                </View>
                <View key="2" style={[styles.page, { backgroundColor: 'rgb(254 243 199)' }]}>
                    <Text style={styles.pageText}>
                        Understand strategies for long-term wealth building and financial security.
                    </Text>
                </View>
                <View key="3" style={[styles.page, { backgroundColor: 'rgb(255 237 213)' }]}>
                    <Text style={styles.pageText}>
                        Gain insights tailored for beginners and professionals alike.
                    </Text>
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
        padding: 20,
        borderRadius: 10,
    },
    pageText: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
        fontWeight: 'bold',
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