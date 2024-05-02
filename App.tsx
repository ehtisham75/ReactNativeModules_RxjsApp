import React from 'react'
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './src/Screens/Home/HomeScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>

        <Stack.Screen name={"HomeScreen"} component={HomeScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
