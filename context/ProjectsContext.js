import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProjectsContext = createContext();

export const useProjectData = () => useContext(ProjectsContext);

export const ProjectsProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);

    const fetchProjects = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');

            if (!token) {
                console.error("No authentication token found");
                return;
            }

            const response = await fetch('https://brillianzhub.eu.pythonanywhere.com/projects/projects_list/', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error("Unable to fetch data now", error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <ProjectsContext.Provider value={{ projects, fetchProjects }}>
            {children}
        </ProjectsContext.Provider>
    );
};
