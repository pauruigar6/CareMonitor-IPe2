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
import ProfileScreen from "./screens/ProfileScreen.js";

import AudioScreen from "./screens/AudioScreen";
import MicrophoneScreen from "./screens/MicrophoneScreen";
import RecordingsScreen from "./screens/RecordingsScreen";

import GalleryScreen from "./screens/GalleryScreen";
import CameraScreen from "./screens/CameraScreen.js";
import PhotoScreen from "./screens/PhotoScreen.js";
import VideoScreen from "./screens/VideoScreen.js";

import TextScreen from "./screens/TextScreen.js";
import KeyboardScreen from "./screens/KeyboardScreen.js";
import NotesScreen from "./screens/TextScreen.js";

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
            name="ProfileScreen"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AudioScreen"
            component={AudioScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MicrophoneScreen"
            component={MicrophoneScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RecordingsScreen"
            component={RecordingsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GalleryScreen"
            component={GalleryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CameraScreen"
            component={CameraScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PhotoScreen"
            component={PhotoScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VideoScreen"
            component={VideoScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TextScreen"
            component={TextScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NotesScreen"
            component={NotesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="KeyboardScreen"
            component={KeyboardScreen}
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
