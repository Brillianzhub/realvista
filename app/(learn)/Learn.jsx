import { createStackNavigator } from '@react-navigation/stack';
import CourseListScreen from '../../screens/Learn/CourseListScreen';
import CourseModuleScreen from '../../screens/Learn/CourseModuleScreen';
import CourseDetailScreen from '../../screens/Learn/CourseDetailScreen.jsx';
import LessonDetail from '../../screens/Learn/LessonDetail.jsx';
import { Ionicons } from '@expo/vector-icons';
import LessonQuestions from '../../screens/Learn/LessonQuestions';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import QuizResult from '../../screens/Learn/QuizResult';
import { useTheme } from "@/context/ThemeContext";


const Stack = createStackNavigator();

const LearnNavigator = () => {
  const { colors } = useTheme();
  const handleBackPress = () => {
    router.replace('HomeScreen');
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CourseListScreen"
        component={CourseListScreen}
        options={{
          headerShown: true,
          title: "Courses",
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.tint,
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackPress} style={{ paddingLeft: 10 }}>
              <Ionicons name="arrow-back" size={24} color={colors.tint} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{
          headerShown: true,
          title: "Course Modules",
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.tint,
        }}
      />
      <Stack.Screen
        name="ModuleDetail"
        component={CourseModuleScreen}
        options={{
          headerShown: true,
          title: "Course Modules",
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.tint,
        }}
      />
      <Stack.Screen
        name="LessonDetail"
        component={LessonDetail}
        options={{
          headerShown: true,
          title: "Lesson 1/x",
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.tint,
        }}
      />
      <Stack.Screen
        name="LessonQuestions"
        component={LessonQuestions}
        options={{
          headerShown: true,
          title: "Exercise",
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.tint,
        }}
      />
      <Stack.Screen
        name="QuizResult"
        component={QuizResult}
        options={{
          headerShown: true,
          title: "Quiz Score",
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.tint,
        }}
      />
    </Stack.Navigator>
  );
};

export default LearnNavigator;
