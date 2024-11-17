import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet, RefreshControl, View } from 'react-native';
import ProjectItem from '@/components/ProjectItem';
import { useNavigation } from '@react-navigation/native';
import { useProjectData } from '@/context/ProjectsContext';

const ProjectList = () => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const { projects, fetchProjects } = useProjectData();

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchProjects();
        setRefreshing(false);
    }, [fetchProjects]);

    const handleItemPress = (projectId) => {
        navigation.navigate('ProjectDetail', { projectId });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={projects}
                renderItem={({ item }) => (
                    <ProjectItem
                        item={item}
                        onPress={() => handleItemPress(item.id)}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#358B8B']}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
});

export default ProjectList;
