import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import {
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from 'react-native-paper';
import EditorScreen from './EditorScreen';

const Stack = createStackNavigator();

const { LightTheme } = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  materialLight: MD3LightTheme,
});

export default function App() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <NavigationContainer theme={LightTheme}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={EditorScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
