import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const capitalizeFirstLetter = (string) => {
    if (!string) return ""; 
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const Details = ({ data }) => {
    return (
        <ScrollView horizontal style={styles.scrollContainer}
            showsHorizontalScrollIndicator={false}
        >
            <View style={styles.container}>
                <View style={styles.item}>
                    <FontAwesome5 name="map" size={16} color="#555" style={styles.icon} />
                    <Text style={styles.label}>State:</Text>
                    <Text style={styles.value}>{capitalizeFirstLetter(data.location)}</Text>
                </View>
                <View style={styles.item}>
                    <FontAwesome5 name="city" size={16} color="#555" style={styles.icon} />
                    <Text style={styles.label}>City:</Text>
                    <Text style={styles.value}>{capitalizeFirstLetter(data.city)}</Text>
                </View>

                <View style={styles.item}>
                    <FontAwesome5 name="building" size={16} color="#555" style={styles.icon} />
                    <Text style={styles.label}>Number of Units:</Text>
                    <Text style={styles.value}>{data.numUnits}</Text>
                </View>
                <View style={styles.item}>
                    <FontAwesome5 name="building" size={16} color="#555" style={styles.icon} />
                    <Text style={styles.label}>Year Bought:</Text>
                    <Text style={styles.value}>{data.year_bought}</Text>
                </View>

                <View style={styles.item}>
                    <FontAwesome5 name="users" size={16} color="#555" style={styles.icon} />
                    <Text style={styles.label}>User Slots:</Text>
                    <Text style={styles.value}>{data.user_slots}</Text>
                </View>

                {data.zipCode ? (
                    <View style={styles.item}>
                        <FontAwesome5 name="map-pin" size={16} color="#555" style={styles.icon} />
                        <Text style={styles.label}>Zip Code:</Text>
                        <Text style={styles.value}>{data.zipCode}</Text>
                    </View>
                ) : null}
            </View>
        </ScrollView>
    );
};

export default Details;

const styles = StyleSheet.create({
    scrollContainer: {
        marginTop: 20,
        marginBottom: 10,
    },
    container: {
        flexDirection: "row",
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    icon: {
        marginRight: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#555",
        marginRight: 5,
    },
    value: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
});