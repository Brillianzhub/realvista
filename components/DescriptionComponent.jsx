import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const DescriptionComponent = ({ description }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <View style={styles.container}>
            <Text
                style={styles.descriptionText}
                numberOfLines={isExpanded ? undefined : 3} 
                ellipsizeMode="tail" 
            >
                {description}
            </Text>
            <TouchableOpacity onPress={toggleDescription} style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>
                    {isExpanded ? "Read Less" : "Read More"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    descriptionText: {
        fontSize: 14,
        color: "#333",
        lineHeight: 20, 
    },
    readMoreButton: {
        marginTop: 5,
        alignSelf: "flex-start", 
    },
    readMoreText: {
        fontSize: 14,
        color: "#FB902E",
        fontWeight: "bold",
    },
});

export default DescriptionComponent;