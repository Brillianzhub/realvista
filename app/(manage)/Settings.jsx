import React from "react";
import { StyleSheet, View } from "react-native";
import CurrencySettings from "@/components/Settings/CurrencySettings";
import UserPermissionSettings from "@/components/Settings/UserPermissionSettings";


const Settings = () => {
    return (
        <View style={styles.container}>
            <CurrencySettings />
            <UserPermissionSettings />
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#ffffff",
    },
});
