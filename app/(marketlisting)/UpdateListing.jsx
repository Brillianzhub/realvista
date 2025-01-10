import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import useFetchUserListedProperties from '../../hooks/useFetchUserListedProperties';
import UpdateListingForm from '../../screens/Market/UpdateListingForm';


const UpdateListing = () => {
    const { property } = useLocalSearchParams();
    const { properties, loading, error } = useFetchUserListedProperties();
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    console.log(selectedProperty)

    useEffect(() => {
        if (properties && property) {
            const filteredProperty = properties.find(
                (prop) => prop.id === Number(property)
            );
            if (filteredProperty) {
                setTimeout(() => {
                    setSelectedProperty(filteredProperty);
                }, 2500); // Adjust delay time as needed
            }
        }
    }, [properties, property]);

    if (loading) {
        return <ActivityIndicator size="large" color="#358B8B" />;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    if (!selectedProperty) {
        return <Text>Property not found. Ensure the property ID matches an existing property.</Text>;
    }

    const handleSubmit = async (values) => {
        console.log(values)
    };

    return (
        <View style={styles.container}>
            <Text>Update coming soon...</Text>
        </View>
        // <View style={styles.container}>
        //     {isSubmitting ? (
        //         <View style={styles.loadingContainer}>
        //             <ActivityIndicator size="large" color="#358B8B" />
        //             <Text style={styles.loadingText}>
        //                 Wait while we update your property...
        //             </Text>
        //         </View>
        //     ) : (
        //         <>
        //             {selectedProperty && (
        //                 <UpdateListingForm property={selectedProperty} onSubmit={handleSubmit} />
        //             )}
        //         </>
        //     )}
        // </View>
    );

};

export default UpdateListing;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
