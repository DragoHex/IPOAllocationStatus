import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppProvider } from './src/context/AppContext';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <PaperProvider>
          <NavigationContainer>
            <BottomTabNavigator />
          </NavigationContainer>
        </PaperProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
