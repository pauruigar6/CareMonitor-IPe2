// WelcomeScreen.js
import React from "react";
import {
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import Styles from "../constants/styles";
import Button from "../components/Button";
import { FONTS, COLORS } from "../constants/appConfig";

const background = require("../assets/background.png");
const logo = require("../assets/logo.png");

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={Styles.container}>
      <ImageBackground source={background} style={Styles.background}>
        <Image source={logo} resizeMode="contain" style={Styles.logo} />
        <Text style={Styles.title}>CARE MONITOR</Text>
        <Text style={Styles.subtitle}>Your health, your control.</Text>
        <SafeAreaView>
          <Button
            title="Login with Email"
            style={Styles.btn}
            onPress={() => navigation.navigate("Login")}
          />
          <View style={Styles.btnContainer}>
            <Text
              style={{
                ...FONTS.body3,
                color: COLORS.white,
              }}
            >
              Don't have an account? 
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={{ ...FONTS.h4, color: COLORS.white }}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default WelcomeScreen;
