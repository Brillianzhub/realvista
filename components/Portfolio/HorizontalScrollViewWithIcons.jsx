import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HorizontalScrollViewWithIcons = ({ items }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
        >
            {items.map((item, index) => (
                <View key={index} style={styles.detailItem}>
                    <Icon
                        name={item.icon}
                        size={24}
                        color={item.iconColor || '#000'}
                        style={styles.icon}
                    />
                    <Text style={styles.detailLabel}>{item.label}</Text>
                    <Text style={[styles.detailValue, item.style]}>{item.value}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    detailItem: {
        alignItems: 'center',
        justifyContent: 'center', 
        marginRight: 20,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        width: 240,
        paddingVertical: 10,
        height: 120,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
        textAlign: 'center', 
    },
    detailValue: {
        fontSize: 16,
        marginTop: 4,
        textAlign: 'center', 
    },
      
});

export default HorizontalScrollViewWithIcons;