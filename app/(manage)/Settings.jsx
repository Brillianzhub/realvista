import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, TextInput, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { useCurrency } from '../../context/CurrencyContext';
import CurrencyData from '../../assets/CurrencyData';

const Settings = () => {
    const { currency, setCurrency } = useCurrency();
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredCurrencies, setFilteredCurrencies] = useState(
        Object.entries(CurrencyData.symbols)
    );

    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = Object.entries(CurrencyData.symbols).filter(([key, name]) =>
            name.toLowerCase().includes(text.toLowerCase()) ||
            key.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCurrencies(filtered);
    };

    const handleCurrencySelect = (key) => {
        setCurrency(key);
        setModalVisible(false);
        setSearchText(""); 
        setFilteredCurrencies(Object.entries(CurrencyData.symbols)); 
        Alert.alert('Currency Updated', `Your preferred currency is now set to ${key}`);
    };


    const renderCurrencyItem = ({ item }) => (
        <TouchableOpacity
            style={styles.currencyItem}
            onPress={() => handleCurrencySelect(item[0])}
        >
            <Text style={styles.currencyText}>{`${item[1]} (${item[0]})`}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* <Text style={styles.header}>Settings</Text> */}
            <View style={styles.settingItem}>
                <Text style={styles.label}>Preferred Currency</Text>
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.selectedCurrency}>{`${CurrencyData.symbols[currency]} (${currency})`}</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalHeader}>Select Currency</Text>
                            {/* Search here */}
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search currency"
                                value={searchText}
                                onChangeText={handleSearch}
                            />
                            <FlatList
                                data={filteredCurrencies}
                                renderItem={renderCurrencyItem}
                                keyExtractor={(item) => item[0]}
                                showsVerticalScrollIndicator={false}
                            />
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    settingItem: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    selectedCurrency: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    currencyItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    currencyText: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#FB902E',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});
