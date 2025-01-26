import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useNavigation } from '@react-navigation/native';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';
import { useGlobalContext } from '@/context/GlobalProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('window');

const PropertyDetailScreen = ({ route }) => {
    const { property } = route.params;
    const { currency } = useCurrency();
    const navigation = useNavigation();

    const [isRecordingInquiry, setIsRecordingInquiry] = useState(false);

    const { user } = useGlobalContext()
    const placeholderImage = "https://via.placeholder.com/400x200?text=No+Image";
    const images = property.images && property.images.length > 0
        ? property.images.map((img) => img.image)
        : [placeholderImage];

    const [activeIndex, setActiveIndex] = useState(0);

    const handleAddBookmark = async (propertyId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');

            if (!token) {
                Alert.alert('Error', 'Authentication token is missing.');
                return;
            }

            const response = await axios.post(
                `https://www.realvistamanagement.com/market/bookmark-property/${propertyId}/`,
                {},
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            Alert.alert('Success', response.data.message || 'Property successfully added to your wish list.');
        } catch (error) {
            if (
                error.response?.status === 400 &&
                error.response?.data?.message === "Property is already added to your wish list."
            ) {
                Alert.alert('Info', 'This property is already bookmarked.');
                return;
            }

            console.error('Error bookmarking property:', error.response?.data || error.message);

            if (error.response?.status === 404) {
                Alert.alert('Error', 'The property does not exist.');
            } else {
                Alert.alert(
                    'Error',
                    error.response?.data?.error || 'An error occurred while bookmarking the property.'
                );
            }
        }
    };

    const contactPropertyOwner = async () => {
        if (!property || !property.owner.email || !user || !user.name || !user.email) {
            Alert.alert('Error', 'Property or user information is missing.');
            return;
        }

        setIsRecordingInquiry(true);
        try {
            await handleInquiryProperty(property.id);
        } catch (error) {
            console.error('Error recording inquiry:', error.response?.data || error.message);
            Alert.alert('Error', 'Unable to record inquiry. Please try again.');
            setIsRecordingInquiry(false);
            return;
        }
        setIsRecordingInquiry(false);

        const ownerEmail = property.owner.email;
        const propertyName = property.title;
        const propertyLocation = property.address;
        const propertyType = property.property_type;
        const userName = user.name;
        const userEmail = user.email;

        const subject = `Interest in Your Property Listing: ${propertyName}`;
        const body = `Hello,\n\nI am ${userName} (${userEmail}), and I am interested in your property titled "${propertyName}" (${propertyType}) located at ${propertyLocation}. I came across this listing on Realvista platform and would like to learn more about the property, including any additional details, availability, and pricing.\n\nPlease let me know how I can proceed or reach out for further discussions. Looking forward to your response.\n\nBest regards,\n${userName}`;
        const mailto = `mailto:${ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        Linking.openURL(mailto).catch((err) => {
            console.error('An error occurred', err);
            Alert.alert(
                'Error',
                'Unable to open email client. Please ensure you have a mail application installed on your device.'
            );
        });
    };


    const handleInquiryProperty = async (propertyId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');

            if (!token) {
                Alert.alert('Error', 'Authentication token is missing.');
                return;
            }

            const response = await axios.get(
                `https://www.realvistamanagement.com/market/inquiry-on-property/${propertyId}/`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

        } catch (error) {
            console.error(
                'Error recording inquiry:',
                error.response?.data || error.message
            );
            Alert.alert('Error', error.response?.data?.detail || 'An error occurred while recording the inquiry.');
        }
    };



    return (
        <ScrollView contentContainerStyle={styles.container}>
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

            <View style={styles.actionBtns}>
                <TouchableOpacity
                    style={styles.contactButton}
                    onPress={contactPropertyOwner}
                >
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 16, fontWeight: 'bold' }}>Contact the Owner</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.wishlistButton}
                    onPress={() => handleAddBookmark(property.id)}
                >
                    <Text style={{ textAlign: 'center', color: '#FB902E', fontSize: 16, fontWeight: 'bold' }}>Add to Wish List</Text>
                </TouchableOpacity>
            </View>

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
        marginTop: 20,
        width: '48%'
    },
    actionBtns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    wishlistButton: {
        borderWidth: 1,
        borderColor: '#FB902E',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 20,
        width: '48%'
    }
});

export default PropertyDetailScreen;
