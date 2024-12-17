import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import GlobalProvider from '../context/GlobalProvider';
import { ProjectsProvider } from '../context/ProjectsContext';
import { InvestmentProvider } from '../context/InvestmentProvider';
import { NotificationProvider } from '../context/NotificationContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { CurrencyProvider } from '../context/CurrencyContext';

const RealVistaLayout = () => {

  return (
    <GestureHandlerRootView style={styles.container}>
      <GlobalProvider>
        <InvestmentProvider>
          <ProjectsProvider>
            <NotificationProvider>
              <PaperProvider>
                <CurrencyProvider>
                  <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="(manage)" options={{ headerShown: false }} />
                    <Stack.Screen name="(learn)" options={{ headerShown: false }} />
                    <Stack.Screen name="(enterprise)" options={{ headerShown: false }} />
                  </Stack>
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
    backgroundColor: '#ADD8E6',
  },
});
