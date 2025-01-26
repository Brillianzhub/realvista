import React from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Modal,
    StyleSheet,
    Pressable,
} from 'react-native';

const SearchFilterModal = ({
    isVisible,
    onClose,
    searchQuery,
    setSearchQuery,
    locationFilter,
    setLocationFilter,
    priceFilter,
    setPriceFilter,
}) => {
    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose} 
        >
            <Pressable style={styles.modalContainer} onPress={onClose}>
                <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search by title"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Filter by location"
                        value={locationFilter}
                        onChangeText={setLocationFilter}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Filter by max price"
                        value={priceFilter}
                        keyboardType="numeric"
                        onChangeText={setPriceFilter}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Apply Filters</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        height: 40,
        width: '100%',
    },
    closeButton: {
        backgroundColor: '#FB902E',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SearchFilterModal;
