// SignupScreen.js
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

import {
  auth,
  createUserWithEmailAndPassword,
  db,
} from "../utils/firebase-config";
import { doc, setDoc } from "firebase/firestore";

const images = {
  logo: require("../assets/logo.png"),
};

const Input = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = () => {
    setIsFocused(true);
  };

  const onBlur = () => {
    setIsFocused(false);
  };

  const onChangeText = (text) => {
    props.onInputChanged(props.id, text);
  };

  const isValid = () => {
    if (props.id === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.value);
    } else if (props.id === "password") {
      return props.value.length >= 6;
    } else if (props.id === "confirmPassword") {
      return props.value === props.passwordValue && props.value.length > 0;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor:
              isFocused && !isValid() ? "red" : appConfig.COLORS.gray,
          },
        ]}
      >
        <TextInput
          value={props.value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          style={styles.input}
          placeholder={props.placeholder}
          placeholderTextColor={
            props.placeholderTextColor || appConfig.COLORS.gray
          }
          autoCapitalize={props.autoCapitalize || "none"}
          secureTextEntry={props.secureTextEntry || false}
        />
      </View>
      {isFocused && !isValid() && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {props.id === "email"
              ? "Invalid email address"
              : props.id === "password"
              ? "Password must be at least 6 characters"
              : props.id === "confirmPassword"
              ? "Passwords do not match"
              : ""}
          </Text>
        </View>
      )}
    </View>
  );
};

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState("");

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCreateAccount = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Guardar user ID en el campo 'id' de la colección 'userInfo'
      const userDocRef = doc(db, "userInfo", user.uid); // Cambia 'userInfo' si es necesario
      await setDoc(userDocRef, {
        id: user.uid, // Añadir el campo 'id' con el ID del usuario
        name,
        email,
      });

      Alert.alert("Account created!");
      console.log(user);
      navigation.navigate("Login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Error",
          "The email address is already in use. Please use a different email."
        );
      } else {
        console.error(error);
        Alert.alert("Error", error.message);
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
          Sign Up
        </Text>
        <Text
          style={{ ...appConfig.FONTS.body3, color: appConfig.COLORS.white }}
        >
          Start your wellness voyage.
        </Text>

        <Input
          id="name"
          placeholder="Name"
          value={name}
          onInputChanged={(id, text) => setName(text)}
        />
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

        <View style={styles.passwordContainer}>
          <Input
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onInputChanged={(id, text) => setConfirmPassword(text)}
            secureTextEntry={!showConfirmPassword}
            passwordValue={password}
          />
          <TouchableOpacity
            onPress={handleToggleConfirmPasswordVisibility}
            style={styles.eyeIcon}
          >
            <FontAwesome5
              name={showConfirmPassword ? "eye-slash" : "eye"}
              size={20}
              color={appConfig.COLORS.white}
            />
          </TouchableOpacity>
        </View>

        <SafeAreaView style={{ marginTop: 72 }}>
          <WhiteButton
            title="Sign Up"
            style={styles.btn}
            onPress={() => handleCreateAccount()}
          />
          <View style={styles.bottomContainer}>
            <Text
              style={{
                ...appConfig.FONTS.body3,
                color: appConfig.COLORS.white,
              }}
            >
              Already have an account ?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text
                style={{ ...appConfig.FONTS.h3, color: appConfig.COLORS.white }}
              >
                {" "}
                Log In
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
  passwordInput: {
    flex: 1,
    height: 40,
    borderColor: appConfig.COLORS.white,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
    color: appConfig.COLORS.white,
  },
  eyeIcon: {
    marginLeft: -40,
  },
  signupText: {
    ...appConfig.FONTS.body3,
    color: appConfig.COLORS.white,
    marginTop: 16,
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

export default SignupScreen;
