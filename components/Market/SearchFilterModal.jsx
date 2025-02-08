import React, { useState } from 'react';
import {
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
    onApplyFilters,
}) => {
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleApplyFilters = () => {
        onApplyFilters({
            description: description.trim(),
            city: city.trim(),
            state: state.trim(),
            minPrice: minPrice ? parseFloat(minPrice) : null,
            maxPrice: maxPrice ? parseFloat(maxPrice) : null,
            generalSearch: '',
        });
        onClose();
    };

    const formatNumberWithCommas = (value) => {
        if (!value) return value;
        const numericValue = value.replace(/[^0-9.]/g, '');
        const [whole, decimal] = numericValue.split('.');
        const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
    };

    const removeCommas = (value) => value.replace(/,/g, '');

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
                        placeholder="Search by description"
                        value={description}
                        onChangeText={setDescription}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Filter by city"
                        value={city}
                        onChangeText={setCity}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Filter by state"
                        value={state}
                        onChangeText={setState}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Min price"
                        value={formatNumberWithCommas(minPrice)}
                        keyboardType="numeric"
                        onChangeText={(value) =>
                            setMinPrice(removeCommas(value))
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Max price"
                        value={formatNumberWithCommas(maxPrice)}
                        keyboardType="numeric"
                        onChangeText={(value) =>
                            setMaxPrice(removeCommas(value))
                        }
                    />
                    <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
                        <Text style={styles.applyButtonText}>Apply Filters</Text>
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
    applyButton: {
        backgroundColor: '#FB902E',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
    },
    applyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SearchFilterModal;
