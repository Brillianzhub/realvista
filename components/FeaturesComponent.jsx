import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

const defaultFeatureIcons = {
    furnished: <MaterialIcons name="weekend" size={20} color="#2ecc71" />,
    parking_available: <FontAwesome5 name="car" size={20} color="#e74c3c" />,
    pet_friendly: <Ionicons name="paw-outline" size={20} color="#e67e22" />,
    security: <Ionicons name="shield-checkmark" size={20} color="#3498db" />,
    electricity_proximity: <Ionicons name="flash" size={20} color="#f1c40f" />,
    water_supply: <MaterialIcons name="water" size={20} color="#1abc9c" />,
    road_network: <Ionicons name="navigate" size={20} color="#9b59b6" />,
    development_level: <FontAwesome5 name="city" size={20} color="#2ecc71" />,
    negotiable: <MaterialIcons name="attach-money" size={20} color="#2ecc71" />,
};

const defaultFormatKey = (key) =>
    key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

const defaultFormatValue = (value) => {
    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }
    if (value === null) {
        return "N/A";
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
};

const FeaturesComponent = ({
    features = [],
    featureIcons = defaultFeatureIcons,
    formatKey = defaultFormatKey,
    formatValue = defaultFormatValue,
}) => {
    if (!features || features.length === 0) {
        return <Text style={styles.noFeaturesText}>No features available</Text>;
    }

    const featureData = features[0]; // Assuming the first object contains all features

    // Filter out `additional_features` and `verified_user`
    const filteredKeys = Object.keys(featureData).filter(
        (key) => key !== "additional_features" && key !== "verified_user"
    );

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
        >
            {filteredKeys.map((key) => (
                <View key={key} style={styles.featureItem}>
                    <View style={styles.iconWrapper}>{featureIcons[key]}</View>
                    <Text style={styles.key}>{formatKey(key)}</Text>
                    <Text style={styles.value}>{formatValue(featureData[key])}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingVertical: 10,
    },
    featureItem: {
        alignItems: "center",
        marginHorizontal: 10,
        padding: 10, // Add padding for better spacing
        backgroundColor: "#f9f9f9", // Light background color
        borderRadius: 8, // Rounded corners for a modern look
        elevation: 2, // Add a slight shadow for depth (Android)
        shadowColor: "#000", // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconWrapper: {
        marginBottom: 5,
    },
    key: {
        fontSize: 12,
        color: "#555",
    },
    value: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    noFeaturesText: {
        textAlign: "center",
        fontSize: 16,
        color: "#777",
    },
});

export default FeaturesComponent;