import React from 'react'
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './src/Screens/Home/HomeScreen';
import ContactScreen from './src/Screens/Contacts/ContactScreen';
import { AppRoutes } from './src/Constants/AppRoutes';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>

        <Stack.Screen name={AppRoutes.HomeScreen} component={HomeScreen} />
        <Stack.Screen name={AppRoutes.ContactScreen} component={ContactScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
