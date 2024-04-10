// HomeScreen.js
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Image } from "react-native";
import appConfig, { COLORS } from "../constants/appConfig";
import ProfileScreen from "./ProfileScreen";
import ResultsScreen from "./ResultsScreen";
import SettingsScreen from "./SettingsScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../utils/firebase-config";
import { collection, getDocs } from 'firebase/firestore';
import AccountScreen from "./AccountScreen";

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
          const initial = userData.name ? userData.name.charAt(0).toUpperCase() : "";
          setUserNameInitial(initial);
        }
      } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={{ height: 130, backgroundColor: appConfig.COLORS.white }}>
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
          <TouchableOpacity onPress={() => navigation.navigate("AccountScreen")}>
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

const HomeScreen = () => {
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
        name="HealthProfile"
        component={ProfileScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="heartbeat" size={size} color={color} solid />
          ),
          tabBarLabel: route.name === "HealthProfile" ? "Health Profile" : null,
        })}
      />
      <Tab.Screen
        name="Results"
        component={ResultsScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="chart-bar" size={size} color={color} solid />
          ),
          tabBarLabel: route.name === "Results" ? "Results" : null,
        })}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="cog" size={size} color={color} solid />
          ),
          tabBarLabel: route.name === "Settings" ? "Settings" : null,
        })}
      />
    </Tab.Navigator>
    
  );
};

export default HomeScreen;
