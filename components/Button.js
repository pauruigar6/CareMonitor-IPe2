// Button.js
import React from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FONTS, COLORS, SIZES } from "../constants/appConfig";
import Styles from "../constants/styles";

const Button = (props) => {
  const isLoading = props.isLoading || false;

  return (
    <TouchableOpacity
      style={{
        ...Styles.btn,
        ...props.style,
      }}
      onPress={props.onPress}
    >
      {isLoading && isLoading == true ? (
        <ActivityIndicator size="small" color={COLORS.white} />
      ) : (
        <Text style={{ ...FONTS.body2, color: COLORS.white }}>
          {props.title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
