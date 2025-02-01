import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

const CourseDescription = ({ description }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={styles.courseDescription}>
            <Text
                style={styles.courseDescriptionText}
                numberOfLines={expanded ? undefined : 2}
                ellipsizeMode="tail"
            >
                {description}
            </Text>

            {description.length > 100 && (
                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                    <Text style={styles.readMoreText}>
                        {expanded ? 'Read Less' : 'Read More'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default CourseDescription;


styles = StyleSheet.create({
    courseDescription: {
        marginBottom: 20,
    },
    courseDescriptionText: {
        fontSize: 16,
        color: '#444',
    },
    readMoreText: {
        color: '#FB902E',
        marginTop: 4,
        fontWeight: 'bold',
    },
})