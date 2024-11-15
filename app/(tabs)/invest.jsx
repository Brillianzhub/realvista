import React, { useState } from 'react';
import { FlatList, StyleSheet, RefreshControl, View } from 'react-native';
import { useProjectData } from '../../context/ProjectsContext';
import ProjectItem from '../../components/ProjectItem';

const ProjectList = ({ navigation }) => {
  const projects = useProjectData();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleProjectPress = (projectId) => {
    navigation.navigate('ProjectDetail', { projectId });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={({ item }) => (
          <ProjectItem
            item={item}
            // onPress={() => handleProjectPress(item.id)}
          />
        )}
        keyExtractor={item => item.id.toString()}
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
    padding: 15
  }
});

export default ProjectList;
