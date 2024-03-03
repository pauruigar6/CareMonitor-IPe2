// input.js
import React from "react";
import { View, Text, TextInput } from "react-native";
import Styles from "./styles";
import { COLORS } from "./appConfig";

const Input = (props) => {
  const onChangeText = (text) => {
    props.onInputChanged(props.id, text);
  };

  return (
    <View style={Styles.container}>
      <View
        style={[Styles.inputContainer, { borderColor: COLORS.gray }]}
      >
        <TextInput
          value={props.value}
          onChangeText={onChangeText}
          style={Styles.input}
          placeholder={props.placeholder}
          placeholderTextColor={
            props.placeholderTextColor || COLORS.gray
          }
          autoCapitalize={props.autoCapitalize || "none"}
          secureTextEntry={props.secureTextEntry || false}
        />
      </View>
      {props.errorText && (
        <View style={Styles.errorContainer}>
          <Text style={Styles.errorText}>{props.errorText[0]}</Text>
        </View>
      )}
    </View>
  );
};

export default Input;
