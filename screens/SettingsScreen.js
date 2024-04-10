// SettingsScreen.js
import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import appConfig, { COLORS, SIZES } from "../constants/appConfig";
import { auth } from "../utils/firebase-config";

const SettingsScreen = ({ navigation }) => {
  const navigateToScreen = (screenName, params) => {
    navigation.navigate(screenName, params);
  };

  const logout = async () => {
    try {
      Alert.alert(
        "Confirmation",
        "Are you sure you want to log out?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: async () => {
              await auth.signOut();
              navigation.replace("Login");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const deleteAccount = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.delete();
        navigation.replace("Login");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const showDeleteAccountConfirmation = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: deleteAccount },
      ],
      { cancelable: false }
    );
  };

  const supportItems = [
    {
      icon: "help-outline",
      text: "Help & Support",
      screen: "HelpSupportScreen",
    },
    {
      icon: "info-outline",
      text: "Terms and Policies",
      screen: "TermsAndPoliciesScreen",
    },
  ];

  const actionItems = [
    { icon: "logout", text: "Log out", action: logout },
    {
      icon: "delete",
      text: "Delete Account",
      action: showDeleteAccountConfirmation,
    },
  ];

  const renderSettingsItem = ({ icon, text, screen, action }) => (
    <TouchableOpacity
      onPress={() => (action ? action() : navigateToScreen(screen))}
      style={styles.card}
    >
      <MaterialIcons
        name={icon}
        size={24}
        color={appConfig.COLORS.primary}
        style={styles.icon}
      />
      <Text style={styles.label}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: appConfig.COLORS.background }}
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: appConfig.COLORS.background,
          padding: 16,
        }}
      >
        <Text style={{ ...appConfig.FONTS.h1, color: appConfig.COLORS.black }}>
          Settings
        </Text>

        {/* Support and About */}
        <View style={styles.section}>
          <Text
            style={{ ...appConfig.FONTS.h2, color: appConfig.COLORS.black }}
          >
            Support & About
          </Text>
          {supportItems.map((item, index) => (
            <React.Fragment key={index}>
              {renderSettingsItem(item)}
            </React.Fragment>
          ))}
        </View>

        {/* Actions Settings */}
        <View style={styles.section}>
          <Text
            style={{ ...appConfig.FONTS.h2, color: appConfig.COLORS.black }}
          >
            Actions & settings
          </Text>
          {actionItems.map((item, index) => (
            <React.Fragment key={index}>
              {renderSettingsItem(item)}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: SIZES.padding * 3,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    marginTop: SIZES.base * 1.5,
  },
  icon: {
    marginRight: SIZES.padding,
  },
  label: {
    fontWeight: "600",
    fontSize: SIZES.h3,
    color: COLORS.black,
  },
});

export default SettingsScreen;
