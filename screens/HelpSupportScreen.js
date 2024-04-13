import React, { useState, useEffect } from "react";
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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
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
            color: COLORS.black,
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
                backgroundColor: COLORS.primary,
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

const HelpAndSupportScreen = ({ navigation }) => {
  const supportEmail = "262119@vut.cz";

  const handleContactSupport = () => {
    let mailtoUrl = `mailto:${supportEmail}`;

    if (Platform.OS === "ios") {
      mailtoUrl += "&subject=Subject&body=Body";
    } else if (Platform.OS === "android") {
      mailtoUrl += "?subject=Subject&body=Body";
    }

    openMailApp(mailtoUrl);
  };

  const openMailApp = (url) => {
    if (Platform.OS === "ios") {
      const gmailWebUrl = "https://mail.google.com/";
      Linking.openURL(gmailWebUrl)
        .then(() => console.log("Opened Gmail in Safari"))
        .catch((err) => console.error("Failed to open Gmail:", err));
    } else if (Platform.OS === "android") {
      Alert.alert("Not supported on this platform");
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text
          style={{ ...appConfig.FONTS.h1, color: COLORS.black, marginTop: 0 }}
        >
          Help & Support
        </Text>

        <View style={styles.contentContainer}>
          <MaterialIcons
            name="email"
            size={48}
            color={COLORS.primary}
            style={styles.icon}
          />
          <Text style={styles.heading}>Please write your issue here:</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleContactSupport}
          >
            <Text style={styles.buttonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: SIZES.padding * 3,
  },
  heading: {
    fontSize: SIZES.h2,
    fontWeight: "bold",
    color: COLORS.black,
  },
  icon: {
    marginBottom: SIZES.padding,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginVertical: SIZES.padding * 2,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.h3,
  },
});

export default HelpAndSupportScreen;
