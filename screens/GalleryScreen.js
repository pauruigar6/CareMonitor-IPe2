import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Image } from "react-native";
import appConfig, { COLORS } from "../constants/appConfig.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../utils/firebase-config.js";
import { collection, getDocs } from "firebase/firestore";

import CameraScreen from "./CameraScreen";
import PhotoScreen from "./PhotoScreen";
import VideoScreen from "./VideoScreen.js";

const Tab = createBottomTabNavigator();

const CustomHeader = ({ navigation }) => {
  const [userNameInitial, setUserNameInitial] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "userInfo"));
        if (querySnapshot.docs.length > 0) {
          const userData = querySnapshot.docs[0].data();
          // Obtén la primera letra del nombre y conviértela a mayúsculas
          const initial = userData.name
            ? userData.name.charAt(0).toUpperCase()
            : "";
          setUserNameInitial(initial);
        }
      } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView
      style={{ height: 130, backgroundColor: appConfig.COLORS.white }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          backgroundColor: appConfig.COLORS.white,
          height: 100,
        }}
      >
        <Image
          source={require("../assets/logo.png")}
          style={{
            width: 50,
            height: 50,
            marginRight: 10,
            tintColor: appConfig.COLORS.black,
            marginLeft: 10,
          }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: appConfig.COLORS.black,
          }}
        >
          Care Monitor
        </Text>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("AccountScreen")}
          >
            <View
              style={{
                width: 60,
                height: 60,
                backgroundColor: appConfig.COLORS.primary,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Text style={{ color: COLORS.white, fontSize: 18 }}>
                {userNameInitial}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const GalleryScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        showLabel: false,
        style: { backgroundColor: appConfig.COLORS.white },
        header: ({ navigation }) => <CustomHeader navigation={navigation} />,
        tabBarStyle: { height: 80 },
        tabBarActiveTintColor: appConfig.COLORS.primary,
      }}
    >
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5
              name="camera"
              size={size}
              color={color}
              solid
            />
          ),
        }}
      />

      <Tab.Screen
        name="Photos"
        component={PhotoScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="image" size={size} color={color} solid />
          ),
        }}
      />
      <Tab.Screen
        name="Videos"
        component={VideoScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="film" size={size} color={color} solid />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default GalleryScreen;
