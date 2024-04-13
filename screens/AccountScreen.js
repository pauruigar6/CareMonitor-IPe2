// AccountScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
  ScrollView,
  Image,
  SafeAreaView
} from "react-native";import { FontAwesome5 } from "@expo/vector-icons";

import appConfig, { COLORS, SIZES } from "../constants/appConfig";
import { getDocs, collection, db } from "../utils/firebase-config";


const CustomHeader = ({ navigation }) => {
  const [userNameInitial, setUserNameInitial] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "userInfo"));
        if (querySnapshot.docs.length > 0) {
          const userData = querySnapshot.docs[0].data();
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
    <SafeAreaView style={{ height: 130, backgroundColor: COLORS.white }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          backgroundColor: COLORS.white,
          height: 100,
          marginTop: 39,

        }}
      >
        <Image
          source={require("../assets/logo.png")}
          style={{
            width: 50,
            height: 50,
            marginRight: 10,
            tintColor: COLORS.black,
            marginLeft: 10,
          }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 10,
            color: COLORS.black,
          }}
        >
          Care Monitor
        </Text>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <TouchableOpacity
          >
            <View
              style={{
                width: 60,
                height: 60,
                backgroundColor: COLORS.primary,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
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

const AccountScreen = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "userInfo"));
        if (querySnapshot.docs.length > 0) {
          const userData = querySnapshot.docs[0].data();
          setUserData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <CustomHeader />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={{ ...appConfig.FONTS.h1, color: COLORS.black, marginBottom: 30 }}>
          My Account
        </Text>
        <View style={styles.card}>
          <FontAwesome5 name="user" solid style={styles.icon} />
          <View style={styles.userInfo}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{userData.name}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <FontAwesome5 name="envelope" solid style={styles.icon} />
          <View style={styles.userInfo}>
            <Text style={styles.label}>Email Address:</Text>
            <Text style={styles.value}>{userData.email}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginTop: 16,
    padding: 16,
  },
  userInfo: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
  },
  icon: {
    marginRight: 10,
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 10,
  },
});

export default AccountScreen;