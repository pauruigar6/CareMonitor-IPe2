// WelcomeScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import appConfig from "../constants/appConfig";
import Button from "../components/Button";

const background = require("../assets/background.png");
const images = {
  logo: require("../assets/logo.png"),
};

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        style={styles.background}
      >
        <Image source={images.logo} resizeMode="contain" style={styles.logo} />
        <Text style={styles.title}>CARE MONITOR</Text>
        <Text style={styles.subtitle}>Your health, your control.</Text>

        <SafeAreaView style={{ marginTop: 72 }}>
          <Button
            title="Login With Email"
            style={styles.btn}
            onPress={() => navigation.navigate("Login")}
          />
          <View style={styles.bottomContainer}>
            <Text
              style={{
                ...appConfig.FONTS.body3,
                color: appConfig.COLORS.white,
              }}
            >
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text
                style={{ ...appConfig.FONTS.h3, color: appConfig.COLORS.white }}
              >
                {" "}
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: appConfig.SIZES.width * 0.4,
    width: appConfig.SIZES.width * 0.4,
    tintColor: appConfig.COLORS.white,
    marginBottom: 30,
  },
  title: {
    ...appConfig.FONTS.h1,
    textTransform: "uppercase",
    color: appConfig.COLORS.white,
  },  
  subtitle: {
    ...appConfig.FONTS.body3,
        color: appConfig.COLORS.white
  },
  btn: {
    width: appConfig.SIZES.width - 44,
  },
  bottomContainer: {
    flexDirection: "row", 
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 12
  },
});

export default WelcomeScreen;
