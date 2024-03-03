import React from "react";
import { StyleSheet } from "react-native";
import { FONTS, COLORS, SIZES } from "./appConfig";

const Styles = StyleSheet.create({
  // WelcomeScreen.js
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
    height: SIZES.width * 0.4,
    width: SIZES.width * 0.4,
    tintColor: COLORS.white,
    marginBottom: 30,
  },
  title: {
    ...FONTS.h1,
    textTransform: "uppercase",
    color: COLORS.white,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.white,
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },

  //Button.js
  btn: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: SIZES.padding,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    width: SIZES.width - 44,
    marginTop: 60
  },
});

export default Styles;
