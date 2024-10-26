import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

const Page = ({ data }) => {
    return (
        <View style={styles.page}>
            {data.map((item, index) => (
                <Text key={index}>{item}</Text>
            ))}
        </View>
    );
};

const MyPagerView = () => {
    const pagerRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [subset, setSubset] = useState([]);

    const data = Array.from({ length: 100 }, (_, index) => `Item ${index + 1}`);
    const subsetSize = 10;

    const handlePageScroll = (event) => {
        const { position } = event.nativeEvent;
        setCurrentPage(position);

        const startIndex = position * subsetSize;
        const endIndex = startIndex + subsetSize;
        const newSubset = data.slice(startIndex, endIndex);
        setSubset(newSubset);
    };

    return (
        <View style={styles.container}>
            <PagerView
                ref={pagerRef}
                style={styles.pager}
                initialPage={0}
                onPageSelected={handlePageScroll}
            >
                {subset.map((item, index) => (
                    <Page key={index} data={[item]} />
                ))}
            </PagerView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default MyPagerView;