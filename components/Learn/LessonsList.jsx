import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

const LessonsList = ({ lessons, navigation, module }) => {
    return (
        <FlatList
            data={lessons}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.lessonCard}
                    onPress={() => navigation.navigate('LessonDetail', {
                        lessons: module.lessons,
                        selectedIndex: item.order - 1,
                        moduleId: module.id
                    })}
                >
                    <View style={styles.lessonItem}>

                        <Text style={styles.lessonTitle}>{item.title}</Text>
                        <Icon name="play-circle" size={24} color="gray" style={styles.playIcon} />

                    </View>
                </TouchableOpacity>
            )}
        />
    );
};

const styles = StyleSheet.create({
    lessonCard: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lessonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    playIcon: {
        marginRight: 10,
    },
    lessonTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
});

export default LessonsList;