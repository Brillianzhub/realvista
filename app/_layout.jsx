import { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import GlobalProvider from '../context/GlobalProvider';
import { ProjectsProvider } from '../context/ProjectsContext';
import { InvestmentProvider } from '../context/InvestmentProvider';
import { NotificationProvider } from '../context/NotificationContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { CurrencyProvider } from '../context/CurrencyContext';
import { ThemeProvider } from '../context/ThemeContext';
import { useFonts } from "expo-font";
import { StatusBar } from 'react-native';

const RealVistaLayout = () => {

  const [fontsLoaded, error] = useFonts({
    "RobotoSerif-Black": require("../assets/fonts/RobotoSerif-Black.ttf"),
    "RobotoSerif-Bold": require("../assets/fonts/RobotoSerif-Bold.ttf"),
    "RobotoSerif-ExtraLight": require("../assets/fonts/RobotoSerif-ExtraLight.ttf"),
    "RobotoSerif-Regular": require("../assets/fonts/RobotoSerif-Regular.ttf"),
    "RobotoSerif-SemiBold": require("../assets/fonts/RobotoSerif-SemiBold.ttf"),
    "RobotoSerif-Thin": require("../assets/fonts/RobotoSerif-Thin.ttf"),
    "RobotoSerif-Light": require("../assets/fonts/RobotoSerif-Light.ttf"),
    "Abel-Regular": require("../assets/fonts/Abel-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <GlobalProvider>
        <InvestmentProvider>
          <ProjectsProvider>
            <NotificationProvider>
              <PaperProvider>
                <CurrencyProvider>
                  <ThemeProvider>
                    <Stack>
                      <Stack.Screen name="index" options={{ headerShown: false }} />
                      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                      <Stack.Screen name="(manage)" options={{ headerShown: false }} />
                      <Stack.Screen name="(learn)" options={{ headerShown: false }} />
                      <Stack.Screen name="(enterprise)" options={{ headerShown: false }} />
                      <Stack.Screen name="(analyser)" options={{ headerShown: false }} />
                      <Stack.Screen name="(trends)" options={{ headerShown: false }} />
                      <Stack.Screen name="(marketlisting)" options={{ headerShown: false }} />
                    </Stack>
                  </ThemeProvider>
                  <StatusBar
                    barStyle="dark-content"
                    backgroundColor="#FFFFFF"
                  />
                </CurrencyProvider>
              </PaperProvider>
            </NotificationProvider>
          </ProjectsProvider>
        </InvestmentProvider>
      </GlobalProvider>
    </GestureHandlerRootView>

  );
};

export default RealVistaLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});