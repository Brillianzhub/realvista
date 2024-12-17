import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

import PagerView from 'react-native-pager-view';

const CourseModuleScreen = ({ route, navigation }) => {
    const { modules, selectedModuleIndex: initialIndex = 0 } = route.params;
    const [selectedModuleIndex, setSelectedModuleIndex] = useState(initialIndex);


    useEffect(() => {
        const module = modules[selectedModuleIndex];
        const totalModules = modules.length;
        navigation.setOptions({
            title: `Module: ${module.order}/${totalModules}`,
        });
    }, [selectedModuleIndex, modules, navigation]);

    const handleModuleSelect = (index) => {
        setSelectedModuleIndex(index);
    };

    return (
        <PagerView
            style={styles.pagerView}
            initialPage={selectedModuleIndex}
            onPageSelected={(e) => handleModuleSelect(e.nativeEvent.position)}
        >
            {modules.map((module, moduleIndex) => (
                <View key={module.id} style={styles.page}>
                    <Text style={styles.moduleTitle}>{module.title}</Text>
                    <View style={styles.moduleDescription}>
                        <Text style={styles.moduleDescriptionText}>{module.description}</Text>
                    </View>
                    <Text style={styles.sectionHeader}>Lessons</Text>
                    <FlatList
                        data={module.lessons}
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
                                <Text style={styles.lessonTitle}>{item.title}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            ))}
        </PagerView>
    );
};

export default CourseModuleScreen;

const styles = StyleSheet.create({
    pagerView: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    page: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F9F9F9',
    },
    moduleTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    moduleDescription: {
        marginBottom: 20,
        backgroundColor: 'rgb(255 237 213)',
        padding: 15,
        borderRadius: 8
    },
    moduleDescriptionText: {
        fontSize: 16,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#358B8B',
        marginBottom: 10,
    },
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
    lessonTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
    },
});
