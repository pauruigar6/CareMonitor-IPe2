// Button.js
import React from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FONTS, COLORS } from "../constants/appConfig";
import Styles from "../constants/styles";

const WhiteButton = (props) => {
  const isLoading = props.isLoading || false;

  return (
    <TouchableOpacity
      style={{
        ...Styles.whiteBtn,
        ...props.style,
      }}
      onPress={props.onPress}
    >
      {isLoading && isLoading == true ? (
        <ActivityIndicator size="small" color={COLORS.primary} />
      ) : (
        <Text style={{ ...FONTS.body2, color: COLORS.primary }}>
          {props.title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default WhiteButton;
