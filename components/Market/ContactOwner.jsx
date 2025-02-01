import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { MaterialIcons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { contactPropertyOwner } from '../../utils/contactPropertyOwner';
import { contactViaWhatsApp } from '../../utils/contactViaWhatsApp';
import { contactViaPhoneCall } from '../../utils/contactViaPhoneCall';

const ContactComponent = ({ owner, property, user, setIsRecordingInquiry }) => {
    const { contact_by_email, contact_by_phone, contact_by_whatsapp, email, phone_number, owner_name, owner_photo } = owner;

    const handlePhoneCallContact = async () => {
        if (contact_by_phone === "True" && phone_number) {
            await contactViaPhoneCall({
                property,
                user,
                setIsRecordingInquiry,
            });
        } else {
            alert(
                "This owner has not enabled phone call contact. You can try reaching out via email or WhatsApp if available."
            );
        }
    };

    const handleEmailContact = () => {
        if (contact_by_email === "True" && email) {
            contactPropertyOwner({
                property,
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
        if (contact_by_whatsapp === "True" && phone_number) {
            await contactViaWhatsApp({
                property,
                user,
                setIsRecordingInquiry,
            });
        } else {
            alert(
                "This owner has not enabled WhatsApp contact. You can try reaching out via email or phone if available."
            );
        }
    };

    return (
        <View style={styles.container}>
            {/* Owner Info Section */}
            <View style={styles.ownerInfoContainer}>
                {/* Owner Photo or Placeholder */}
                <View style={styles.ownerPhotoContainer}>
                    {owner_photo ? (
                        <Image source={{ uri: owner_photo }} style={styles.ownerPhoto} />
                    ) : (
                        <View style={styles.ownerPhotoPlaceholder}>
                            <Text style={styles.ownerPhotoPlaceholderText}>👤</Text>
                        </View>
                    )}
                </View>

                {/* Owner Name */}
                {owner_name && <Text style={styles.ownerName}>{owner_name}</Text>}

                {/* Owner Subtitle */}
                <Text style={styles.ownerSubtitle}>Owner</Text>
            </View>

            {/* Contacts Section */}
            <View style={styles.contactsContainer}>
                <TouchableOpacity style={styles.contactItem} onPress={handleEmailContact}>
                    <MaterialIcons name="email" size={24} color="#3498db" />
                    <Text style={styles.contactText}>Email</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactItem} onPress={handlePhoneCallContact}>
                    <FontAwesome name="phone" size={24} color="#2ecc71" />
                    <Text style={styles.contactText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactItem} onPress={handleWhatsAppContact}>
                    <FontAwesome5 name="whatsapp" size={24} color="#25D366" />
                    <Text style={styles.contactText}>WhatsApp</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        marginVertical: 10,
        backgroundColor: "#fff", 
    },
    ownerInfoContainer: {
        alignItems: "center",
        marginBottom: 16,
    },
    ownerPhotoContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#f0f0f0", 
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    ownerPhoto: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    ownerPhotoPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    ownerPhotoPlaceholderText: {
        fontSize: 24,
    },
    ownerName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4, // Space between name and subtitle
    },
    ownerSubtitle: {
        fontSize: 14,
        color: "#888", // Light-colored subtitle
    },
    contactsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    
    },
    contactItem: {
        alignItems: "center",
        width: '30%',
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: "#f9f9f9", 
    },
    contactText: {
        marginTop: 5,
        fontSize: 14,
        color: "#333",
        fontWeight: "500",
    },
});

export default ContactComponent;