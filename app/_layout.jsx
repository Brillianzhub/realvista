import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import GlobalProvider from '../context/GlobalProvider';

const RealVistaLayout = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <GlobalProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(manage)" options={{ headerShown: false }} />
        </Stack>
      </GlobalProvider>
    </GestureHandlerRootView>
  );
};

export default RealVistaLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
