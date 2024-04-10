// HelpAndSupportScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import appConfig, { COLORS, SIZES } from "../constants/appConfig"; // Asegúrate de importar tus estilos y configuraciones

const HelpAndSupportScreen = () => {
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
      // Puedes agregar aquí la lógica para abrir el cliente de correo en Android si lo deseas
      Alert.alert("Not supported on this platform");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text
          style={{ ...appConfig.FONTS.h1, color: COLORS.black, marginTop: 30 }}
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
    </SafeAreaView>
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
    marginBottom: SIZES.padding * 2,
    color: COLORS.black,
  },
  icon: {
    marginBottom: SIZES.padding,
    marginTop: SIZES.padding * 3,
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
