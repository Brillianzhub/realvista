import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    Linking,
    StyleSheet,
    FlatList,
    RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ReleasedSlots = ({ route }) => {
    const { propertyId } = route.params || {};
    const [releasedSlots, setReleasedSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchReleasedSlots = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.get(
                `https://realvistamanagement.com/enterprise/released-slots/?property_id=${propertyId}`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            const userSlots = response.data;
            setReleasedSlots(userSlots);
        } catch (error) {
            console.error('Fetch failed:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (propertyId) {
            fetchReleasedSlots();
        }
    }, [propertyId]);

    const handleContactUser = (email) => {
        Linking.openURL(`mailto:${email}`);
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchReleasedSlots();
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.property}</Text>
            <View style={styles.cardContent}>
                <View style={styles.row}>
                    <Icon name="group" size={20} color="#000" />
                    <Text style={styles.text}>{item.group}</Text>
                </View>
                <View style={styles.row}>
                    <Icon name="event-available" size={20} color="#000" />
                    <Text style={styles.text}>Slots Available: {item.number_of_slots}</Text>
                </View>
                <View style={styles.row}>
                    <Icon name="calendar-today" size={20} color="#000" />
                    <Text style={styles.text}>Released At: {new Date(item.released_at).toLocaleString()}</Text>
                </View>
                <View style={styles.row}>
                    <Icon name="person" size={20} color="#000" />
                    <Text style={styles.text}>Owner: {item.user_name}</Text>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleContactUser(item.user)}
                >
                    <Icon name="email" size={20} color="#fff" />
                    <Text style={styles.buttonText}> Contact User</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#358B8B" />
            ) : (
                <FlatList
                    data={releasedSlots}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={<Text>No released slots available.</Text>}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

export default ReleasedSlots;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#358B8B'
    },
    cardContent: {
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    text: {
        marginLeft: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FB902E',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        marginLeft: 5,
    },
});