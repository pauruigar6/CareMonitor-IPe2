// LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import appConfig from "../constants/appConfig";
import { FontAwesome5 } from "@expo/vector-icons";
import WhiteButton from "../components/WhiteButton";

import { auth, signInWithEmailAndPassword } from "../utils/firebase-config";

const images = {
  logo: require("../assets/logo.png"),
};

const Input = (props) => {
  const onChangeText = (text) => {
    props.onInputChanged(props.id, text);
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.inputContainer, { borderColor: appConfig.COLORS.gray }]}
      >
        <TextInput
          value={props.value}
          onChangeText={onChangeText}
          style={styles.input}
          placeholder={props.placeholder}
          placeholderTextColor={
            props.placeholderTextColor || appConfig.COLORS.gray
          }
          autoCapitalize={props.autoCapitalize || "none"}
          secureTextEntry={props.secureTextEntry || false}
        />
      </View>
      {props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText[0]}</Text>
        </View>
      )}
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Login successful:", user.uid);

      navigation.navigate("HomeScreen");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "No user found with this email address.");
      } else if (error.code === "auth/invalid-credential") {
        Alert.alert("Error", "Invalid credentials. Please check your email and password.");
      } else {

      }
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: appConfig.COLORS.primary }}
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: appConfig.COLORS.primary,
          padding: 16,
        }}
      >
        <Image
          source={images.logo}
          resizeMode="contain"
          style={{
            width: 50,
            height: 50,
            tintColor: appConfig.COLORS.white,
            marginBottom: 20,
            marginTop: 60,
          }}
        />
        <Text style={{ ...appConfig.FONTS.h2, color: appConfig.COLORS.white }}>
          Log In
        </Text>
        <Text
          style={{ ...appConfig.FONTS.body3, color: appConfig.COLORS.white }}
        >
          Seamless access to your health journey.
        </Text>

        <Input
          id="email"
          placeholder="Email Address"
          value={email}
          onInputChanged={(id, text) => setEmail(text)}
          keyboardType="email-address"
        />
        <View style={styles.passwordContainer}>
          <Input
            id="password"
            placeholder="Password"
            value={password}
            onInputChanged={(id, text) => setPassword(text)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={handleTogglePasswordVisibility}
            style={styles.eyeIcon}
          >
            <FontAwesome5
              name={showPassword ? "eye-slash" : "eye"}
              size={20}
              color={appConfig.COLORS.white}
            />
          </TouchableOpacity>
        </View>

        <SafeAreaView style={{ marginTop: 72 }}>
          <WhiteButton
            title="Log In"
            style={styles.whiteBtn}
            onPress={handleLogin}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: appConfig.SIZES.padding,
    paddingVertical: appConfig.SIZES.padding2,
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: appConfig.COLORS.white,
    marginVertical: 16,
    flexDirection: "row",
  },
  input: {
    color: appConfig.COLORS.white,
    flex: 1,
    paddingTop: 0,
    fontSize: 18,
  },
  errorContainer: {
    marginVertical: 4,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    marginLeft: -40,
  },
  btn: {
    width: appConfig.SIZES.width - 44,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
});

export default LoginScreen;
