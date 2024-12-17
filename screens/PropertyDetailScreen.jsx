import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useNavigation } from '@react-navigation/native';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';
import { useGlobalContext } from '@/context/GlobalProvider';

const { width } = Dimensions.get('window');

const PropertyDetailScreen = ({ route }) => {
    const { property } = route.params;
    const { currency } = useCurrency();
    const navigation = useNavigation();

    const { user } = useGlobalContext()
    // Placeholder image if no images are provided
    const placeholderImage = "https://via.placeholder.com/400x200?text=No+Image";
    const images = property.images && property.images.length > 0
        ? property.images
        : [placeholderImage];

    const [activeIndex, setActiveIndex] = useState(0);


    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Image Slider */}
            <View style={styles.imageSlider}>
                <PagerView
                    style={styles.pagerView}
                    onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
                >
                    {images.map((image, index) => (
                        <View key={index} style={styles.slide}>
                            <Image source={{ uri: image }} style={styles.image} />
                        </View>
                    ))}
                </PagerView>
                <View style={styles.pagination}>
                    {images.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                activeIndex === index ? styles.activeDot : null,
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* Property Details */}

            <Text style={styles.title}>{property.title}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.price}>Price</Text>
                <Text style={styles.price}>{formatCurrency(property.price, currency)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.details}>Location</Text>
                <Text style={styles.details}>{property.city}, {property.state}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.details}>Bedrooms</Text>
                <Text style={styles.details}>{property.bedrooms || 'N/A'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.details}>Bathrooms</Text>
                <Text style={styles.details}>{property.bathrooms || 'N/A'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.details}>Area (Square Meter)</Text>
                <Text style={styles.details}>{property.square_feet || 'N/A'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.details}>Year Built</Text>
                <Text style={styles.details}>{property.year_built || 'N/A'}</Text>
            </View>
            <View>
                <Text style={styles.description}>{property.description}</Text>
            </View>

            <TouchableOpacity
                style={styles.contactButton}
                onPress={() => navigation.navigate('ChatScreen', { roomId: property.id, userId: user.id })}
            >
                <Text style={{ textAlign: 'center', color: 'white', fontSize: 16, fontWeight: 'bold' }}>Chat with Owner</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    imageSlider: {
        marginBottom: 20,
    },
    pagerView: {
        height: 200,
        width: '100%',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#358B8B',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        color: '#358B8B',
        marginBottom: 10,
    },
    details: {
        fontSize: 16,
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#555',
        marginTop: 10,
    },
    contactButton: {
        backgroundColor: '#FB902E',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 20
    },
});

export default PropertyDetailScreen;
