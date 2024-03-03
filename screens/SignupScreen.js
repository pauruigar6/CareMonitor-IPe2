// SignupScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Styles from "../constants/styles";
import Input from "../constants/input";
import { logo } from "../constants/images";
import { FontAwesome5 } from "@expo/vector-icons";
import { COLORS } from "../constants/appConfig";
import WhiteButtom from "../components/WhiteButton";

const LoginScreen = ({ navigation }) => {
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

  return (
    <SafeAreaView style={Styles.safeAreaView}>
      <ScrollView style={Styles.scrollView}>
        <Image source={logo} resizeMode="contain" style={Styles.smallLogo} />
        <Text style={Styles.smallTitle}>Sign Up</Text>
        <Text style={Styles.subtitle}>Start your wellness voyage.</Text>

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

        <View style={Styles.passwordContainer}>
          <Input
            id="password"
            placeholder="Password"
            value={password}
            onInputChanged={(id, text) => setPassword(text)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={handleTogglePasswordVisibility}
            style={Styles.eyeIcon}
          >
            <FontAwesome5
              name={showPassword ? "eye-slash" : "eye"}
              size={20}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        <View style={Styles.passwordContainer}>
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
            style={Styles.eyeIcon}
          >
            <FontAwesome5
              name={showConfirmPassword ? "eye-slash" : "eye"}
              size={20}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        <WhiteButtom
          title="Sign Up"
          style={Styles.whiteBtn}
          onPress={() => navigation.navigate("Login")}
        />

        <View style={Styles.btnContainer}>
          <Text style={Styles.subtitle}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={Styles.btnText}> Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
