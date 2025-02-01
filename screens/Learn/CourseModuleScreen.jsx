import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import CourseDescription from '../../components/Learn/CourseDescription';
import LessonsList from '../../components/Learn/LessonsList';

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
                    {module.image && (
                        <Image
                            source={{ uri: module.image }}
                            style={styles.moduleImage}
                        />
                    )}
                    <Text style={styles.moduleTitle}>{module.title}</Text>
                    <View>
                        <Text style={styles.courseTitle}>Focus</Text>
                        <CourseDescription description={module.description} />
                    </View>
                    <Text style={styles.sectionHeader}>Lessons</Text>
                    <LessonsList
                        lessons={module.lessons}
                        navigation={navigation}
                        module={module}
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
        fontSize: 20,
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
    moduleImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 15,
    },
    lessonTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
    },
    courseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
    },
});
