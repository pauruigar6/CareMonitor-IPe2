// ProfileScreen.js
import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; // Importa FontAwesome5
import appConfig from "../constants/appConfig";

const ProfileScreen = ({ navigation }) => {
  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation("AudioScreen")}
          >
            <FontAwesome5
              name="volume-up"
              size={50}
              color={appConfig.COLORS.white}
            />
            <Text style={styles.buttonText}>Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation("GalleryScreen")}
          >
            <FontAwesome5
              name="camera"
              size={50}
              color={appConfig.COLORS.white}
            />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation("TextScreen")}
          >
            <FontAwesome5
              name="file-alt"
              size={50}
              color={appConfig.COLORS.white}
            />
            <Text style={styles.buttonText}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation("HandwritingScreen")}
          >
            <FontAwesome5 name="pen" size={50} color={appConfig.COLORS.white} />
            <Text style={styles.buttonText}>Handwriting</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appConfig.COLORS.background,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    width: 300,
    height: 350,
    backgroundColor: appConfig.COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: appConfig.COLORS.white,
    fontSize: 26,
    marginTop: 5, // Añade un pequeño espacio entre el icono y el texto
  },
});

export default ProfileScreen;
