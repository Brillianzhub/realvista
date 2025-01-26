import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useNavigation } from '@react-navigation/native';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';
import { useGlobalContext } from '@/context/GlobalProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import icon from '@/constants/images';
import { handleAddBookmark } from '../utils/handleBookmarks';
import { contactPropertyOwner } from '../utils/contactPropertyOwner';
import { contactViaWhatsApp } from '../utils/contactViaWhatsApp';
import { contactViaPhoneCall } from '../utils/contactViaPhoneCall';
import { Ionicons } from '@expo/vector-icons';



const MarketDetailScreen = ({ selectedItem, closeBottomSheet }) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const { user } = useGlobalContext()
    const [currentPage, setCurrentPage] = useState(0);
    const [isRecordingInquiry, setIsRecordingInquiry] = useState(false);

    if (!selectedItem) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Property details are unavailable.</Text>
            </View>
        );
    }

    const {
        title,
        description,
        address,
        city,
        state,
        price,
        currency,
        bathrooms,
        bedrooms,
        square_feet,
        lot_size,
        year_built,
        features,
        availability_date,
        property_type,
        listing_purpose,
        owner,
    } = selectedItem;

    const details = [
        { key: 'Bathrooms', value: bathrooms || 'N/A' },
        { key: 'Bedrooms', value: bedrooms || 'N/A' },
        { key: 'Square Feet', value: square_feet || 'N/A' },
        { key: 'Lot Size', value: lot_size || 'N/A' },
        { key: 'Year Built', value: year_built || 'N/A' },
        { key: 'Availability', value: availability_date || 'N/A' },
    ];


    const images = (selectedItem.images)
        .map((img) => img.image || img.image_url)
        .filter(Boolean)

    const truncatedDescription = description?.length > 100
        ? `${description.slice(0, 100)}...`
        : description;

    const items = features?.[0]
        ? [
            { label: 'Negotiable', value: `${features[0].negotiable || 'Not Available'}` },
            { label: 'Furnished', value: `${features[0].furnished || 'Not Available'}` },
            { label: 'Parking Space', value: `${features[0].parking_available || 'Not Available'}` },
            { label: 'Pet Friendly', value: `${features[0].pet_friendly || 'Not Available'}` },
            { label: 'Electricity Proximity', value: `${features[0].electricity_proximity || 'Not Available'}` },
            { label: 'Road Network', value: `${features[0].road_network || 'Not Available'}` },
            { label: 'Development Level', value: `${features[0].development_level || 'Not Available'}` },
            { label: 'Water Supply', value: `${features[0].water_supply || 'Not Available'}` },
            { label: 'Security', value: `${features[0].security || 'Not Available'}` },
            { label: 'Additional Features', value: `${features[0].additional_features || 'Not Available'}` },
        ]
        : [];

    const handleEmailContact = () => {
        if (selectedItem.owner.contact_by_email === "True") {
            contactPropertyOwner({
                selectedItem,
                user,
                setIsRecordingInquiry,
            });
        } else {
            alert(
                "This owner has not enabled email contact. You can try reaching out via WhatsApp or phone if available."
            );
        }
    };

    const handleWhatsAppContact = async () => {
        if (selectedItem.owner.contact_by_whatsapp === "True") {
            await contactViaWhatsApp({
                selectedItem,
                user,
                setIsRecordingInquiry,
            });
        } else {
            alert(
                "This owner has not enabled WhatsApp contact. You can try reaching out via email or phone if available."
            );
        }
    };

    const handlePhoneCallContact = async () => {
        if (selectedItem.owner.contact_by_phone === "True") {
            await contactViaPhoneCall({
                selectedItem,
                user,
                setIsRecordingInquiry,
            });
        } else {
            alert(
                "This owner has not enabled phone call contact. You can try reaching out via email or WhatsApp if available."
            );
        }
    };


    return (
        <ScrollView
            style={styles.container}
        >
            {images.length > 0 ? (
                <View>
                    <PagerView
                        style={styles.pagerView}
                        initialPage={0}
                        onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
                    >
                        {images.map((img, index) => (
                            <View key={index} style={styles.imageContainer}>
                                <Image source={{ uri: img }} style={styles.image} />
                            </View>
                        ))}
                    </PagerView>
                    <View style={styles.pagination}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index === activeIndex && styles.activeDot,
                                ]}
                            />
                        ))}
                    </View>
                </View>
            ) : (
                <Text style={styles.noImageText}>No images available</Text>
            )}
            <Text style={styles.title}>{title}</Text>

            <View style={styles.subtileSection}>
                <View>
                    <Text style={styles.subtitle}>
                        {state.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())},{' '}
                        {city.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                    </Text>
                    <Text style={styles.price}>{formatCurrency(price, currency)}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleAddBookmark(selectedItem.id)}
                >
                    <View style={styles.iconRing}>
                        <Image
                            source={icon.heart}
                            style={styles.iconImage}
                            resizeMode='cover'
                        />
                    </View>

                </TouchableOpacity>
            </View>
            <View style={styles.descriptionContainer}>
                <Text style={styles.description}>
                    {isDescriptionExpanded ? description : truncatedDescription}
                </Text>
                {description.length > 100 && (
                    <TouchableOpacity
                        onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    >
                        <Text style={{ color: '#FB902E' }}>
                            {isDescriptionExpanded ? 'Show Less' : 'Read More'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={{ marginTop: 30 }}>
                {details.map((detail, index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.key}>{detail.key}</Text>
                        <Text style={styles.value}>{detail.value}</Text>
                    </View>
                ))}
            </View>


            <View style={{ marginTop: 30 }}>
                <Text style={styles.sectionHeader}>Features</Text>
                <PagerView
                    style={styles.featurePagerView}
                    initialPage={0}
                    onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
                >
                    {items.map((item, index) => (
                        <View key={index} style={styles.detailItem}>
                            <Text style={styles.detailLabel}>{item.label.toUpperCase()}</Text>
                            <Text style={[styles.detailValue, item.style]}>{item.value.toUpperCase()}</Text>
                        </View>
                    ))}
                </PagerView>
                <View style={styles.featureDotsContainer}>
                    {items.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.featureDot,
                                currentPage === index ? styles.featureActiveDot : styles.featureInactiveDot,
                            ]}
                        />
                    ))}
                </View>
            </View>

            <View style={{ marginTop: 30 }}>
                <Text style={styles.sectionHeader}>Contact Seller</Text>
                <View style={styles.contactContainer}>
                    <TouchableOpacity style={styles.contactItem}
                        onPress={handleWhatsAppContact}
                    >
                        <View style={styles.iconRing}>
                            <Image
                                source={icon.whatsapp}
                                style={styles.iconImage}
                            />
                        </View>
                        <Text style={styles.contactLabel}>WhatsApp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactItem}
                        onPress={handlePhoneCallContact}
                    >
                        <View style={styles.iconRing}>
                            <Image
                                source={icon.call}
                                style={styles.iconImage}
                            />
                        </View>
                        <Text style={styles.contactLabel}>Phone</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactItem}
                        onPress={handleEmailContact}
                    >
                        <View style={styles.iconRing}>
                            <Image
                                source={icon.email}
                                style={styles.iconImage}
                            />
                        </View>
                        <Text style={styles.contactLabel}>Email</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default MarketDetailScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        marginBottom: 80
    },
    subtileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        fontWeight: 'bold',
    },
    pagerView: { height: 200, marginBottom: 10 },
    imageContainer: { flex: 1 },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    pagination: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc', marginHorizontal: 4 },
    activeDot: { backgroundColor: '#000' },
    noImageText: { textAlign: 'center', color: '#aaa', marginVertical: 20 },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 8,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FB902E',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#666',
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    featurePagerView: {
        flex: 1,
        height: 100,
        marginVertical: 10
    },
    featureDotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    featureDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    featureActiveDot: {
        backgroundColor: '#358B8B',
    },
    featureInactiveDot: {
        backgroundColor: '#D3D3D3',
    },
    detailItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        margin: 10,
        elevation: 3,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    detailValue: {
        fontSize: 16,
        color: '#555',
    },

    contactContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 15,
    },
    contactItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconRing: {
        width: 60,
        height: 60,
        borderWidth: 1.5,
        borderRadius: 30,
        borderColor: '#358B8B3A',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    iconImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    contactLabel: {
        marginTop: 5,
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
        paddingVertical: 10,
    },
    key: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        flex: 1,
    },
    value: {
        fontSize: 16,
        color: '#358B8B',
        flex: 1,
        textAlign: 'right',
    },

});