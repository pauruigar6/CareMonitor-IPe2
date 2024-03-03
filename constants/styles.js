// styles.js
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
  btnText: {
    ...FONTS.h4,
    color: COLORS.white,
  },

  // Button.js
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
    marginTop: 60,
  },
  whiteBtn: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    borderColor: COLORS.white,
    borderWidth: 2,
    borderRadius: SIZES.padding,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    width: SIZES.width - 44,
    marginTop: 60,
  },

  // input.ja
  inputContainer: {
    width: "100%",
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding2,
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.white,
    marginVertical: 16,
    flexDirection: "row",
  },
  input: {
    color: COLORS.white,
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

  // LoginScreen.js
  safeAreaView: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  smallLogo: {
    width: 50,
    height: 50,
    tintColor: COLORS.white,
    marginBottom: 20,
    marginTop: 60,
  },
  smallTitle: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    marginLeft: -26,
  },
});

export default Styles;
