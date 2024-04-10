// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AudioProvider } from "./utils/AudioContext";

import WelcomeScreen from "./screens/WelcomeScreen";
import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import AccountScreen from "./screens/AccountScreen";
import AudioScreen from "./screens/AudioScreen";
import ResultsScreen from "./screens/ResultsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import HelpSupportScreen from "./screens/HelpSupportScreen";
import TermsAndPoliciesScreen from "./screens/TermsAndPoliciesScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <AudioProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AccountScreen"
            component={AccountScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AudioScreen"
            component={AudioScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ResultsScreen"
            component={ResultsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HelpSupportScreen"
            component={HelpSupportScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TermsAndPoliciesScreen"
            component={TermsAndPoliciesScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AudioProvider>
  );
};

export default App;
